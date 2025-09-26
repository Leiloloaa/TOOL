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
    const line = document.lineAt(position.line);
    const text = line.text;

    console.log(
      `悬停检测: 行文本 = "${text}", 光标位置 = ${position.character}`
    );

    // 查找当前位置附近的数学表达式
    const expression = this.findMathExpression(text, position.character);
    console.log(`悬停找到的表达式: ${expression}`);

    if (expression) {
      const result = this.calculateExpression(expression);
      console.log(`悬停计算结果: ${result}`);
      if (result !== null) {
        this.lastCalculation = `${expression} = ${result}`;
        this.statusBarItem.text = `$(symbol-numeric) ${this.lastCalculation}`;
        this.statusBarItem.tooltip = `计算结果: ${this.lastCalculation}`;

        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`## 计算结果\n\n`);
        markdown.appendMarkdown(`**${expression} = ${result}**`);
        markdown.appendMarkdown(`\n\n---\n`);
        markdown.appendMarkdown(`点击状态栏查看详细计算`);

        console.log(`返回悬停提示`);
        return new vscode.Hover(markdown);
      }
    }

    console.log(`悬停未找到表达式`);
    return null;
  }

  onDocumentChange(event: vscode.TextDocumentChangeEvent) {
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

        // 更新代码镜头显示内联结果
        this.updateCodeLenses(document, position.line, expression, result);
      }
    } else {
      this.statusBarItem.text = "$(symbol-numeric) Code Inline Calculator";
      console.log(`未找到表达式，状态栏重置`);
      this.clearCodeLenses();
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

        // 显示替换提示
        vscode.window.showInformationMessage(
          `表达式已替换: ${expression} → ${result}`
        );
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

    const document = activeEditor.document;
    const position = activeEditor.selection.active;
    const line = document.lineAt(position.line);
    const text = line.text;

    // 查找表达式在行中的位置
    const expressionStart = text.indexOf(expression);
    if (expressionStart === -1) return;

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

    // 显示替换提示
    vscode.window.showInformationMessage(
      `表达式已替换: ${expression} → ${result}`
    );
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
}

export function deactivate() {
  console.log("Code Inline Calculator 插件已停用");
}
