import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Code Inline Calculator 插件已激活");

  // 显示激活消息
  vscode.window.showInformationMessage("Code Inline Calculator 插件已激活！");

  // 创建计算器提供者
  const calculatorProvider = new CalculatorProvider();

  // 注册悬停提供者
  const hoverProvider = vscode.languages.registerHoverProvider(
    "*",
    calculatorProvider
  );

  // 注册代码镜头提供者（用于显示内联结果）
  const codeLensProvider = vscode.languages.registerCodeLensProvider(
    "*",
    calculatorProvider
  );

  // 注册文档变化监听器
  const documentChangeListener = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      calculatorProvider.onDocumentChange(event);
    }
  );

  // 注册键盘事件监听器（回车键替换）
  const keyListener = vscode.workspace.onDidChangeTextDocument((event) => {
    calculatorProvider.onKeyPress(event);
  });

  // 注册命令
  const calculateCommand = vscode.commands.registerCommand(
    "calculator-helper.calculate",
    () => {
      calculatorProvider.showCalculation();
    }
  );

  // 注册替换命令
  const replaceCommand = vscode.commands.registerCommand(
    "calculator-helper.replace",
    (expression: string, result: number) => {
      calculatorProvider.replaceExpression(expression, result);
    }
  );

  context.subscriptions.push(
    hoverProvider,
    codeLensProvider,
    documentChangeListener,
    keyListener,
    calculateCommand,
    replaceCommand
  );
}

class CalculatorProvider
  implements vscode.HoverProvider, vscode.CodeLensProvider
{
  private statusBarItem: vscode.StatusBarItem;
  private lastCalculation: string = "";
  private codeLenses: vscode.CodeLens[] = [];
  private currentQuickPick: vscode.QuickPick<vscode.QuickPickItem> | null =
    null;
  private debounceTimer: NodeJS.Timeout | null = null;
  private isReplacing: boolean = false;

  constructor() {
    // 创建状态栏项
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = "calculator-helper.calculate";
    this.statusBarItem.text = "$(symbol-numeric) Code Inline Calculator";
    this.statusBarItem.tooltip = "Code Inline Calculator - 点击查看计算结果";
    this.statusBarItem.show();

    console.log("状态栏已创建");
  }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // 悬停功能已屏蔽
    return null;
  }

  onDocumentChange(event: vscode.TextDocumentChangeEvent) {
    // 如果正在替换表达式，忽略文档变化事件
    if (this.isReplacing) {
      console.log("正在替换表达式，忽略文档变化事件");
      return;
    }

    // 检查是否是替换操作导致的变化（通过检查变化内容是否为纯数字）
    if (event.contentChanges.length > 0) {
      const change = event.contentChanges[0];
      const newText = change.text;
      // 如果新文本是纯数字（可能是替换结果），跳过弹框
      if (/^\d+(\.\d+)?$/.test(newText.trim())) {
        console.log("检测到数字替换，跳过弹框");
        return;
      }
    }

    // 当文档内容变化时，检查是否有新的数学表达式
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return;

    const document = activeEditor.document;
    const position = activeEditor.selection.active;
    const line = document.lineAt(position.line);
    const text = line.text;

    console.log(`文档变化检测: 当前行文本 = "${text}"`);

    // 检查当前行是否包含数学表达式（不需要光标在特定位置）
    const expression = this.findMathExpressionInLine(text);
    console.log(`找到的表达式: ${expression}`);

    if (expression) {
      const result = this.calculateExpression(expression);
      console.log(`计算结果: ${result}`);
      if (result !== null) {
        this.lastCalculation = `${expression} = ${result}`;
        this.statusBarItem.text = `$(symbol-numeric) ${this.lastCalculation}`;
        this.statusBarItem.tooltip = `计算结果: ${this.lastCalculation}`;
        console.log(`状态栏更新: ${this.statusBarItem.text}`);

        // 更新代码镜头显示内联结果（已屏蔽）
        // this.updateCodeLenses(document, position.line, expression, result);

        // 使用防抖机制，避免频繁弹框
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.showPathLikeTooltip(expression, result, position);
        }, 50);
      }
    } else {
      this.statusBarItem.text = "$(symbol-numeric) Code Inline Calculator";
      console.log(`未找到表达式，状态栏重置`);
      // this.clearCodeLenses();
    }
  }

  onKeyPress(event: vscode.TextDocumentChangeEvent) {
    // 检查是否按下了回车键
    if (event.contentChanges.length > 0) {
      const change = event.contentChanges[0];
      if (change.text === "\n" || change.text === "\r\n") {
        this.handleEnterKey(event.document, change.range.start);
      }
    }
  }

  private handleEnterKey(
    document: vscode.TextDocument,
    position: vscode.Position
  ) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return;

    const line = document.lineAt(position.line - 1); // 获取上一行（回车前的行）
    const text = line.text;

    // 查找数学表达式
    const expression = this.findMathExpressionInLine(text);
    if (expression) {
      const result = this.calculateExpression(expression);
      if (result !== null) {
        // 替换表达式为结果
        const expressionStart = text.indexOf(expression);
        const expressionEnd = expressionStart + expression.length;

        const edit = new vscode.WorkspaceEdit();
        edit.replace(
          document.uri,
          new vscode.Range(
            position.line - 1,
            expressionStart,
            position.line - 1,
            expressionEnd
          ),
          result.toString()
        );

        vscode.workspace.applyEdit(edit);

        // 显示替换提示（2秒后自动消失）
        const originalText = this.statusBarItem.text;
        this.statusBarItem.text = `$(check) 表达式已替换: ${expression} → ${result}`;
        setTimeout(() => {
          this.statusBarItem.text = originalText;
        }, 2000);
      }
    }
  }

  showCalculation() {
    if (this.lastCalculation) {
      vscode.window.showInformationMessage(this.lastCalculation);
    } else {
      vscode.window.showInformationMessage("没有找到可计算的表达式");
    }
  }

  replaceExpression(expression: string, result: number) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return;

    // 设置替换标志，防止触发新的弹框
    this.isReplacing = true;

    const document = activeEditor.document;
    const position = activeEditor.selection.active;
    const line = document.lineAt(position.line);
    const text = line.text;

    // 查找表达式在行中的位置
    const expressionStart = text.indexOf(expression);
    if (expressionStart === -1) {
      this.isReplacing = false;
      return;
    }

    const expressionEnd = expressionStart + expression.length;

    // 替换表达式为结果
    const edit = new vscode.WorkspaceEdit();
    edit.replace(
      document.uri,
      new vscode.Range(
        position.line,
        expressionStart,
        position.line,
        expressionEnd
      ),
      result.toString()
    );

    vscode.workspace.applyEdit(edit);

    // 显示替换提示（2秒后自动消失）
    const originalText = this.statusBarItem.text;
    this.statusBarItem.text = `$(check) 表达式已替换: ${expression} → ${result}`;
    setTimeout(() => {
      this.statusBarItem.text = originalText;
    }, 2000);

    // 延迟重置替换标志，确保替换操作完成
    setTimeout(() => {
      this.isReplacing = false;
      console.log("替换操作完成，重置标志位");
    }, 1000);
  }

  private findMathExpression(
    text: string,
    cursorPosition: number
  ): string | null {
    // 匹配多个数字和运算符的连续表达式，如 1+2+3, 2*3*4, 1+2-3*4
    const mathPattern = /(\d+(?:\.\d+)?(?:\s*[+\-*/]\s*\d+(?:\.\d+)?)+)/g;
    let match;

    while ((match = mathPattern.exec(text)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;

      // 检查光标是否在匹配的表达式范围内
      if (cursorPosition >= start && cursorPosition <= end) {
        return match[0].trim();
      }
    }

    return null;
  }

  private findMathExpressionInLine(text: string): string | null {
    // 匹配多个数字和运算符的连续表达式，如 1+2+3, 2*3*4, 1+2-3*4
    const mathPattern = /(\d+(?:\.\d+)?(?:\s*[+\-*/]\s*\d+(?:\.\d+)?)+)/;
    const match = text.match(mathPattern);

    if (match) {
      return match[0].trim();
    }

    return null;
  }

  private calculateExpression(expression: string): number | null {
    try {
      // 解析多个数字和运算符的表达式，如 1+2+3, 2*3*4, 1+2-3*4
      const tokens = this.parseExpression(expression);
      if (tokens.length === 0) return null;

      // 按照运算符优先级计算：先乘除，后加减
      const result = this.evaluateExpression(tokens);

      // 保留两位小数
      return result !== null ? Math.round(result * 100) / 100 : null;
    } catch (error) {
      console.error("计算表达式时出错:", error);
    }

    return null;
  }

  private parseExpression(expression: string): (number | string)[] {
    // 解析表达式为数字和运算符的数组
    const tokens: (number | string)[] = [];
    const regex = /(\d+(?:\.\d+)?)|([+\-*/])/g;
    let match;

    while ((match = regex.exec(expression)) !== null) {
      if (match[1]) {
        // 数字
        tokens.push(parseFloat(match[1]));
      } else if (match[2]) {
        // 运算符
        tokens.push(match[2]);
      }
    }

    return tokens;
  }

  private evaluateExpression(tokens: (number | string)[]): number | null {
    if (tokens.length === 0) return null;
    if (tokens.length === 1 && typeof tokens[0] === "number") return tokens[0];

    // 先处理乘除运算
    const processedTokens = this.processMultiplyDivide(tokens);
    if (processedTokens === null) return null;

    // 再处理加减运算
    return this.processAddSubtract(processedTokens);
  }

  private processMultiplyDivide(
    tokens: (number | string)[]
  ): (number | string)[] | null {
    const result: (number | string)[] = [];
    let i = 0;

    while (i < tokens.length) {
      if (typeof tokens[i] === "number") {
        result.push(tokens[i]);
        i++;
      } else if (tokens[i] === "*" || tokens[i] === "/") {
        if (
          result.length === 0 ||
          typeof result[result.length - 1] !== "number"
        ) {
          return null;
        }
        if (i + 1 >= tokens.length || typeof tokens[i + 1] !== "number") {
          return null;
        }

        const left = result[result.length - 1] as number;
        const operator = tokens[i];
        const right = tokens[i + 1] as number;

        let resultValue: number;
        if (operator === "*") {
          resultValue = left * right;
        } else {
          if (right === 0) {
            console.error("除数不能为零");
            return null;
          }
          resultValue = left / right;
        }

        result[result.length - 1] = resultValue;
        i += 2;
      } else {
        result.push(tokens[i]);
        i++;
      }
    }

    return result;
  }

  private processAddSubtract(tokens: (number | string)[]): number | null {
    if (tokens.length === 0) return null;
    if (typeof tokens[0] !== "number") return null;

    let result = tokens[0] as number;
    let i = 1;

    while (i < tokens.length) {
      if (tokens[i] === "+" || tokens[i] === "-") {
        if (i + 1 >= tokens.length || typeof tokens[i + 1] !== "number") {
          return null;
        }

        const operator = tokens[i];
        const right = tokens[i + 1] as number;

        if (operator === "+") {
          result += right;
        } else {
          result -= right;
        }

        i += 2;
      } else {
        return null;
      }
    }

    return result;
  }

  // 代码镜头提供者方法
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    return this.codeLenses;
  }

  private updateCodeLenses(
    document: vscode.TextDocument,
    lineNumber: number,
    expression: string,
    result: number
  ) {
    const line = document.lineAt(lineNumber);
    const expressionStart = line.text.indexOf(expression);
    const expressionEnd = expressionStart + expression.length;

    const codeLens = new vscode.CodeLens(
      new vscode.Range(lineNumber, expressionEnd, lineNumber, line.text.length),
      {
        title: `= ${result} (点击替换)`,
        command: "calculator-helper.replace",
        arguments: [expression, result],
      }
    );

    this.codeLenses = [codeLens];
  }

  private clearCodeLenses() {
    this.codeLenses = [];
  }

  private showPathLikeTooltip(
    expression: string,
    result: number,
    position: vscode.Position
  ) {
    // 创建一个类似路径提示框的装饰器
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return;

    // 创建装饰器类型（已注释）
    // const decorationType = vscode.window.createTextEditorDecorationType({
    //   after: {
    //     contentText: ` = ${result}`,
    //     color: new vscode.ThemeColor("editorInfo.foreground"),
    //     backgroundColor: new vscode.ThemeColor("editorInfo.background"),
    //     border: `1px solid ${new vscode.ThemeColor("editorInfo.border")}`,
    //     fontStyle: "italic",
    //     fontWeight: "bold",
    //   },
    //   rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    // });

    // 找到表达式在行中的位置
    // const line = activeEditor.document.lineAt(position.line);
    // const expressionStart = line.text.indexOf(expression);
    // if (expressionStart === -1) return;

    // const expressionEnd = expressionStart + expression.length;
    // const range = new vscode.Range(
    //   position.line,
    //   expressionEnd,
    //   position.line,
    //   expressionEnd
    // );

    // 应用装饰器
    // activeEditor.setDecorations(decorationType, [range]);

    // 3秒后清除装饰器
    // setTimeout(() => {
    //   decorationType.dispose();
    // }, 3000);

    // 立即显示快速选择框
    this.showQuickPickTooltip(expression, result);
  }

  private showQuickPickTooltip(expression: string, result: number) {
    // 检查是否已经有快速选择框在显示，避免重复
    if (this.currentQuickPick) {
      this.currentQuickPick.hide();
    }

    // 创建一个快速选择框，类似路径提示框
    const quickPick = vscode.window.createQuickPick();
    this.currentQuickPick = quickPick;

    quickPick.title = "计算结果";
    quickPick.placeholder = "选择操作";
    quickPick.items = [
      {
        label: `$(symbol-numeric) ${expression} = ${result}`,
        description: "显示计算结果",
        detail: "按回车键替换表达式",
      },
    ];

    quickPick.onDidChangeSelection((selection) => {
      if (selection.length > 0) {
        // 点击选择项时只关闭弹框，不执行任何操作
        quickPick.hide();
        this.currentQuickPick = null;
      }
    });

    quickPick.onDidAccept(() => {
      // 按回车键默认替换表达式
      this.replaceExpression(expression, result);
      quickPick.hide();
      this.currentQuickPick = null;
    });

    quickPick.onDidHide(() => {
      this.currentQuickPick = null;
    });

    quickPick.show();
  }
}

export function deactivate() {
  console.log("Code Inline Calculator 插件已停用");
}
