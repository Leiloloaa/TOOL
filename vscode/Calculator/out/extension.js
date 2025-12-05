"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log("Code Inline Calculator 插件已激活");
    // 显示激活消息
    vscode.window
        .showInformationMessage("Code Inline Calculator 插件已激活！")
        .then(undefined, (error) => {
        if (error && error?.name !== "Canceled") {
            console.error("显示激活消息时出错:", error);
        }
    });
    // 创建计算器提供者
    const calculatorProvider = new CalculatorProvider();
    // 注册悬停提供者
    const hoverProvider = vscode.languages.registerHoverProvider("*", calculatorProvider);
    // 注册代码镜头提供者（用于显示内联结果）
    const codeLensProvider = vscode.languages.registerCodeLensProvider("*", calculatorProvider);
    // 注册文档变化监听器
    const documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        calculatorProvider.onDocumentChange(event);
    });
    // 注册键盘事件监听器（回车键替换）
    const keyListener = vscode.workspace.onDidChangeTextDocument((event) => {
        calculatorProvider.onKeyPress(event);
    });
    // 注册命令
    const calculateCommand = vscode.commands.registerCommand("calculator-helper.calculate", () => {
        calculatorProvider.showCalculation();
    });
    // 注册替换命令
    const replaceCommand = vscode.commands.registerCommand("calculator-helper.replace", (expression, result) => {
        calculatorProvider.replaceExpression(expression, result);
    });
    // 将状态栏项添加到订阅中，确保正确清理
    context.subscriptions.push(hoverProvider, codeLensProvider, documentChangeListener, keyListener, calculateCommand, replaceCommand, calculatorProvider.statusBarItem);
}
exports.activate = activate;
class CalculatorProvider {
    constructor() {
        this.lastCalculation = "";
        this.codeLenses = [];
        this.currentQuickPick = null;
        this.debounceTimer = null;
        this.isReplacing = false;
        // 创建状态栏项
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = "calculator-helper.calculate";
        this.statusBarItem.text = "$(symbol-numeric) Code Inline Calculator";
        this.statusBarItem.tooltip = "Code Inline Calculator - 点击查看计算结果";
        console.log("正在创建状态栏项...");
        console.log("状态栏文本:", this.statusBarItem.text);
        console.log("状态栏命令:", this.statusBarItem.command);
        this.statusBarItem.show();
        console.log("状态栏已创建并显示");
        // 延迟检查状态栏是否真的显示了
        setTimeout(() => {
            console.log("状态栏项状态检查:", {
                text: this.statusBarItem.text,
                command: this.statusBarItem.command,
                tooltip: this.statusBarItem.tooltip,
            });
        }, 1000);
    }
    provideHover(document, position, token) {
        // 悬停功能已屏蔽
        return null;
    }
    onDocumentChange(event) {
        try {
            // 如果正在替换表达式，忽略文档变化事件
            if (this.isReplacing) {
                console.log("正在替换表达式，忽略文档变化事件");
                return;
            }
            // 当文档内容变化时，检查是否有新的数学表达式
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor)
                return;
            const document = activeEditor.document;
            const position = activeEditor.selection.active;
            // 检查位置是否有效
            if (position.line < 0 || position.line >= document.lineCount) {
                return;
            }
            const line = document.lineAt(position.line);
            const text = line.text;
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
            // 检查当前行是否包含等号（=）才触发计算逻辑
            // 注意：检查的是当前行的完整文本，而不是只检查 change.text
            // 这样即使等号已经输入，后续输入表达式时也能触发计算
            if (!text.includes("=")) {
                console.log("当前行未包含等号，跳过计算");
                return;
            }
            console.log(`文档变化检测: 当前行文本 = "${text}"`);
            // 检查是否输入了 "= "（等号+空格），如果是则立即触发计算弹框
            const hasEqualsSpace = /=\s+/.test(text);
            const isEqualsSpaceInput = event.contentChanges.length > 0 &&
                (event.contentChanges[0].text === "= " ||
                    (event.contentChanges[0].text === " " && text.trim().endsWith("=")) ||
                    (event.contentChanges[0].text === "=" && text.includes("= ")));
            // 检查表达式在等号前：如 "1+2="
            let expression = this.findMathExpressionBeforeEquals(text);
            let expressionPosition = "before";
            // 如果没有找到等号前的表达式，检查等号后的表达式：如 "= 1+2"
            if (!expression) {
                expression = this.findMathExpressionAfterEquals(text);
                expressionPosition = "after";
            }
            console.log(`找到的表达式: ${expression} (位置: ${expressionPosition})`);
            // 只更新状态栏，不触发弹框
            if (expression) {
                const result = this.calculateExpression(expression);
                console.log(`计算结果: ${result}`);
                if (result !== null) {
                    this.lastCalculation = `${expression} = ${result}`;
                    this.statusBarItem.text = `$(symbol-numeric) ${this.lastCalculation}`;
                    this.statusBarItem.tooltip = `计算结果: ${this.lastCalculation} - 点击查看`;
                    console.log(`状态栏更新: ${this.statusBarItem.text}`);
                }
            }
            else {
                this.statusBarItem.text = "$(symbol-numeric) Code Inline Calculator";
                this.statusBarItem.tooltip =
                    "Code Inline Calculator - 选中表达式后点击查看计算结果";
                console.log(`未找到表达式，状态栏重置`);
            }
        }
        catch (error) {
            // 忽略取消错误，其他错误记录日志
            if (error && error?.name !== "Canceled") {
                console.error("文档变化处理时出错:", error);
            }
        }
    }
    onKeyPress(event) {
        // 检查是否按下了回车键
        if (event.contentChanges.length > 0) {
            const change = event.contentChanges[0];
            if (change.text === "\n" || change.text === "\r\n") {
                this.handleEnterKey(event.document, change.range.start);
            }
        }
    }
    handleEnterKey(document, position) {
        try {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor)
                return;
            // 检查行号是否有效
            const lineNumber = position.line - 1;
            if (lineNumber < 0 || lineNumber >= document.lineCount) {
                return;
            }
            const line = document.lineAt(lineNumber); // 获取上一行（回车前的行）
            const text = line.text;
            // 查找等号后的数学表达式
            const expression = this.findMathExpressionAfterEquals(text);
            if (expression) {
                const result = this.calculateExpression(expression);
                if (result !== null) {
                    // 替换等号和表达式为结果，删除计算结果后面的等号
                    const equalsIndex = text.indexOf("=");
                    const expressionStart = equalsIndex; // 从等号开始替换
                    const expressionEnd = text.length;
                    // 查找计算结果后面是否有等号，如果有则删除
                    let resultText = ` ${result}`;
                    const afterResult = text.substring(equalsIndex + 1).trim();
                    if (afterResult.startsWith(expression)) {
                        // 如果等号后是表达式，检查表达式后面是否有等号
                        const expressionEndIndex = equalsIndex +
                            1 +
                            afterResult.indexOf(expression) +
                            expression.length;
                        const remainingText = text.substring(expressionEndIndex).trim();
                        if (remainingText.startsWith("=")) {
                            // 删除计算结果后面的等号
                            resultText = ` ${result}${remainingText.substring(1)}`;
                        }
                    }
                    const edit = new vscode.WorkspaceEdit();
                    edit.replace(document.uri, new vscode.Range(position.line - 1, expressionStart, position.line - 1, expressionEnd), resultText);
                    vscode.workspace.applyEdit(edit).then((success) => {
                        if (success) {
                            // 显示替换提示（2秒后自动消失）
                            const originalText = this.statusBarItem.text;
                            this.statusBarItem.text = `$(check) 表达式已替换: ${expression} → ${result}`;
                            setTimeout(() => {
                                this.statusBarItem.text = originalText;
                            }, 2000);
                        }
                    }, (error) => {
                        // 忽略取消错误，其他错误记录日志
                        if (error?.name !== "Canceled") {
                            console.error("替换表达式时出错:", error);
                        }
                    });
                }
            }
        }
        catch (error) {
            // 忽略取消错误，其他错误记录日志
            if (error && error?.name !== "Canceled") {
                console.error("处理回车键时出错:", error);
            }
        }
    }
    showCalculation() {
        try {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showInformationMessage("请先打开一个文件");
                return;
            }
            // 获取选中的文本
            const selection = activeEditor.selection;
            let selectedText = "";
            let hasSelection = false;
            if (!selection.isEmpty) {
                // 如果有选中文本，使用选中的文本
                selectedText = activeEditor.document.getText(selection).trim();
                hasSelection = true;
                console.log(`检测到选中文本: "${selectedText}"`);
            }
            else {
                // 如果没有选中文本，获取光标所在行的文本
                const line = activeEditor.document.lineAt(selection.active.line);
                selectedText = line.text.trim();
                console.log(`未选中文本，使用光标所在行: "${selectedText}"`);
            }
            console.log(`处理的文本: "${selectedText}"`);
            // 尝试从选中文本中提取表达式
            let expression = null;
            // 先尝试查找等号后的表达式
            expression = this.findMathExpressionAfterEquals(selectedText);
            // 如果没有找到，尝试查找等号前的表达式
            if (!expression) {
                expression = this.findMathExpressionBeforeEquals(selectedText);
            }
            // 如果还是没有找到，尝试直接匹配数学表达式（不包含等号）
            if (!expression) {
                expression = this.findMathExpressionInLine(selectedText);
            }
            // 如果仍然没有找到，尝试直接使用选中的文本（如果它看起来像表达式）
            if (!expression && selectedText) {
                // 移除所有空格
                const cleanedText = selectedText.replace(/\s+/g, "");
                // 检查是否是纯数学表达式（只包含数字、运算符和小数点）
                const mathOnlyPattern = /^[\d+\-*/\.]+$/;
                if (mathOnlyPattern.test(cleanedText)) {
                    // 验证是否包含至少一个运算符
                    if (/[+\-*/]/.test(cleanedText)) {
                        // 验证表达式格式：至少两个数字和一个运算符
                        const hasValidFormat = /^\d+(?:\.\d+)?([+\-*/]\d+(?:\.\d+)?)+$/.test(cleanedText);
                        if (hasValidFormat) {
                            expression = cleanedText;
                            console.log(`从选中文本中提取到纯表达式: "${expression}"`);
                        }
                        else {
                            // 尝试更宽松的匹配：允许单个数字后跟运算符和数字
                            const relaxedPattern = /^(\d+(?:\.\d+)?)([+\-*/])(\d+(?:\.\d+)?)$/;
                            if (relaxedPattern.test(cleanedText)) {
                                expression = cleanedText;
                                console.log(`从选中文本中提取到简单表达式: "${expression}"`);
                            }
                        }
                    }
                }
            }
            console.log(`最终提取的表达式: ${expression || "未找到"}`);
            if (expression) {
                const result = this.calculateExpression(expression);
                if (result !== null) {
                    const calculation = `${expression} = ${result}`;
                    this.lastCalculation = calculation;
                    this.statusBarItem.text = `$(symbol-numeric) ${calculation}`;
                    this.statusBarItem.tooltip = `计算结果: ${calculation}`;
                    // 显示计算结果弹框
                    this.showQuickPickTooltip(expression, result);
                }
                else {
                    vscode.window.showInformationMessage(`无法计算表达式: ${expression}`);
                }
            }
            else {
                // 提供更详细的错误信息
                const errorMsg = hasSelection
                    ? `未找到可计算的表达式。选中的文本: "${selectedText}"\n请确保选中的是数学表达式（如：1+2、1+2+3、2*3、= 1+2 等）`
                    : `未找到可计算的表达式。当前行文本: "${selectedText}"\n请选中一个数学表达式（如：1+2、1+2+3、2*3、= 1+2 等）`;
                if (this.lastCalculation) {
                    // 如果有上次的计算结果，显示它
                    const parts = this.lastCalculation.split(" = ");
                    if (parts.length === 2) {
                        this.showQuickPickTooltip(parts[0], parseFloat(parts[1]));
                    }
                    else {
                        vscode.window.showInformationMessage(this.lastCalculation);
                    }
                }
                else {
                    vscode.window.showInformationMessage(errorMsg);
                }
            }
        }
        catch (error) {
            if (error && error?.name !== "Canceled") {
                console.error("显示计算时出错:", error);
                vscode.window.showErrorMessage("计算时出错: " + error.message);
            }
        }
    }
    replaceExpression(expression, result) {
        try {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor)
                return;
            // 设置替换标志，防止触发新的弹框
            this.isReplacing = true;
            const document = activeEditor.document;
            const position = activeEditor.selection.active;
            // 检查行号是否有效
            if (position.line < 0 || position.line >= document.lineCount) {
                this.isReplacing = false;
                return;
            }
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
            edit.replace(document.uri, new vscode.Range(position.line, expressionStart, position.line, expressionEnd), result.toString());
            vscode.workspace.applyEdit(edit).then((success) => {
                if (success) {
                    // 显示替换提示（2秒后自动消失）
                    const originalText = this.statusBarItem.text;
                    this.statusBarItem.text = `$(check) 表达式已替换: ${expression} → ${result}`;
                    setTimeout(() => {
                        this.statusBarItem.text = originalText;
                    }, 2000);
                }
                // 延迟重置替换标志，确保替换操作完成
                setTimeout(() => {
                    this.isReplacing = false;
                    console.log("替换操作完成，重置标志位");
                }, 1000);
            }, (error) => {
                // 忽略取消错误，其他错误记录日志
                if (error?.name !== "Canceled") {
                    console.error("替换表达式时出错:", error);
                }
                // 即使出错也要重置标志位
                setTimeout(() => {
                    this.isReplacing = false;
                    console.log("替换操作失败，重置标志位");
                }, 100);
            });
        }
        catch (error) {
            // 忽略取消错误，其他错误记录日志
            if (error && error?.name !== "Canceled") {
                console.error("替换表达式时出错:", error);
            }
            // 重置标志位
            this.isReplacing = false;
        }
    }
    findMathExpression(text, cursorPosition) {
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
    findMathExpressionInLine(text) {
        // 匹配多个数字和运算符的连续表达式，如 1+2+3, 2*3*4, 1+2-3*4
        // 也支持简单的表达式如 1+2, 2*3
        const mathPattern = /(\d+(?:\.\d+)?(?:\s*[+\-*/]\s*\d+(?:\.\d+)?)+)/;
        let match = text.match(mathPattern);
        if (match) {
            return match[0].trim();
        }
        // 如果上面的正则没匹配到，尝试匹配简单的两数运算，如 1+2, 2*3
        const simplePattern = /(\d+(?:\.\d+)?\s*[+\-*/]\s*\d+(?:\.\d+)?)/;
        match = text.match(simplePattern);
        if (match) {
            return match[0].trim();
        }
        return null;
    }
    findMathExpressionBeforeEquals(text) {
        // 查找等号前的数学表达式，如 "1+2=" 中的 "1+2"
        // 支持单个数字：如 "1=" 或 "1.5="
        // 支持多个数字和运算符：如 "1+2+3=" 或 "2*3*4="
        const equalsPattern = /(\d+(?:\.\d+)?(?:\s*[+\-*/]\s*\d+(?:\.\d+)?)*)\s*=/;
        const match = text.match(equalsPattern);
        if (match && match[1]) {
            const expression = match[1].trim();
            // 确保表达式不为空
            if (expression.length > 0) {
                return expression;
            }
        }
        return null;
    }
    findMathExpressionAfterEquals(text) {
        // 查找等号后的数学表达式，如 "result = 1+2+3" 中的 "1+2+3"
        // 支持单个数字：如 "= 1" 或 "= 1.5"
        // 支持多个数字和运算符：如 "= 1+2+3" 或 "= 2*3*4"
        const equalsPattern = /=\s*(\d+(?:\.\d+)?(?:\s*[+\-*/]\s*\d+(?:\.\d+)?)*)/;
        const match = text.match(equalsPattern);
        if (match && match[1]) {
            const expression = match[1].trim();
            // 确保表达式不为空
            if (expression.length > 0) {
                return expression;
            }
        }
        return null;
    }
    calculateExpression(expression) {
        try {
            // 解析多个数字和运算符的表达式，如 1+2+3, 2*3*4, 1+2-3*4
            const tokens = this.parseExpression(expression);
            if (tokens.length === 0)
                return null;
            // 按照运算符优先级计算：先乘除，后加减
            const result = this.evaluateExpression(tokens);
            // 保留两位小数
            return result !== null ? Math.round(result * 100) / 100 : null;
        }
        catch (error) {
            console.error("计算表达式时出错:", error);
        }
        return null;
    }
    parseExpression(expression) {
        // 解析表达式为数字和运算符的数组
        const tokens = [];
        const regex = /(\d+(?:\.\d+)?)|([+\-*/])/g;
        let match;
        while ((match = regex.exec(expression)) !== null) {
            if (match[1]) {
                // 数字
                tokens.push(parseFloat(match[1]));
            }
            else if (match[2]) {
                // 运算符
                tokens.push(match[2]);
            }
        }
        return tokens;
    }
    evaluateExpression(tokens) {
        if (tokens.length === 0)
            return null;
        if (tokens.length === 1 && typeof tokens[0] === "number")
            return tokens[0];
        // 先处理乘除运算
        const processedTokens = this.processMultiplyDivide(tokens);
        if (processedTokens === null)
            return null;
        // 再处理加减运算
        return this.processAddSubtract(processedTokens);
    }
    processMultiplyDivide(tokens) {
        const result = [];
        let i = 0;
        while (i < tokens.length) {
            if (typeof tokens[i] === "number") {
                result.push(tokens[i]);
                i++;
            }
            else if (tokens[i] === "*" || tokens[i] === "/") {
                if (result.length === 0 ||
                    typeof result[result.length - 1] !== "number") {
                    return null;
                }
                if (i + 1 >= tokens.length || typeof tokens[i + 1] !== "number") {
                    return null;
                }
                const left = result[result.length - 1];
                const operator = tokens[i];
                const right = tokens[i + 1];
                let resultValue;
                if (operator === "*") {
                    resultValue = left * right;
                }
                else {
                    if (right === 0) {
                        console.error("除数不能为零");
                        return null;
                    }
                    resultValue = left / right;
                }
                result[result.length - 1] = resultValue;
                i += 2;
            }
            else {
                result.push(tokens[i]);
                i++;
            }
        }
        return result;
    }
    processAddSubtract(tokens) {
        if (tokens.length === 0)
            return null;
        if (typeof tokens[0] !== "number")
            return null;
        let result = tokens[0];
        let i = 1;
        while (i < tokens.length) {
            if (tokens[i] === "+" || tokens[i] === "-") {
                if (i + 1 >= tokens.length || typeof tokens[i + 1] !== "number") {
                    return null;
                }
                const operator = tokens[i];
                const right = tokens[i + 1];
                if (operator === "+") {
                    result += right;
                }
                else {
                    result -= right;
                }
                i += 2;
            }
            else {
                return null;
            }
        }
        return result;
    }
    // 代码镜头提供者方法
    provideCodeLenses(document) {
        return this.codeLenses;
    }
    updateCodeLenses(document, lineNumber, expression, result) {
        const line = document.lineAt(lineNumber);
        const expressionStart = line.text.indexOf(expression);
        const expressionEnd = expressionStart + expression.length;
        const codeLens = new vscode.CodeLens(new vscode.Range(lineNumber, expressionEnd, lineNumber, line.text.length), {
            title: `= ${result} (点击替换)`,
            command: "calculator-helper.replace",
            arguments: [expression, result],
        });
        this.codeLenses = [codeLens];
    }
    clearCodeLenses() {
        this.codeLenses = [];
    }
    showPathLikeTooltip(expression, result, position) {
        // 创建一个类似路径提示框的装饰器
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor)
            return;
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
    showQuickPickTooltip(expression, result) {
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
function deactivate() {
    console.log("Code Inline Calculator 插件已停用");
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map