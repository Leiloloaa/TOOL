// 随机密码生成器模块

const PasswordTool = {
  lengthSlider: null,
  lengthValue: null,
  uppercaseCheck: null,
  lowercaseCheck: null,
  numbersCheck: null,
  symbolsCheck: null,
  outputEl: null,
  generateBtn: null,
  copyBtn: null,
  toggleBtn: null,
  isVisible: false,

  // 字符集
  UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LOWERCASE: "abcdefghijklmnopqrstuvwxyz",
  NUMBERS: "0123456789",
  SYMBOLS: "!@#$%^&*()_+-=[]{}|;:,.<>?",

  init() {
    this.lengthSlider = document.getElementById("password-length");
    this.lengthValue = document.getElementById("password-length-value");
    this.uppercaseCheck = document.getElementById("password-uppercase");
    this.lowercaseCheck = document.getElementById("password-lowercase");
    this.numbersCheck = document.getElementById("password-numbers");
    this.symbolsCheck = document.getElementById("password-symbols");
    this.outputEl = document.getElementById("password-output");
    this.generateBtn = document.getElementById("password-generate-btn");
    this.copyBtn = document.getElementById("password-copy-btn");
    this.toggleBtn = document.getElementById("password-toggle-btn");

    if (!this.generateBtn) {
      console.error("密码生成器元素未找到");
      return;
    }

    // 绑定事件
    if (this.lengthSlider) {
      this.lengthSlider.addEventListener("input", (e) => {
        this.lengthValue.textContent = e.target.value;
      });
    }

    this.generateBtn.addEventListener("click", () => this.generate());

    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => this.copy());
    }

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggleVisibility());
    }
  },

  /**
   * 生成密码
   */
  generate() {
    const length = parseInt(this.lengthSlider?.value || 16, 10);
    const useUppercase = this.uppercaseCheck?.checked ?? true;
    const useLowercase = this.lowercaseCheck?.checked ?? true;
    const useNumbers = this.numbersCheck?.checked ?? true;
    const useSymbols = this.symbolsCheck?.checked ?? true;

    // 构建字符集
    let charset = "";
    const required = [];

    if (useUppercase) {
      charset += this.UPPERCASE;
      required.push(this.getRandomChar(this.UPPERCASE));
    }
    if (useLowercase) {
      charset += this.LOWERCASE;
      required.push(this.getRandomChar(this.LOWERCASE));
    }
    if (useNumbers) {
      charset += this.NUMBERS;
      required.push(this.getRandomChar(this.NUMBERS));
    }
    if (useSymbols) {
      charset += this.SYMBOLS;
      required.push(this.getRandomChar(this.SYMBOLS));
    }

    if (charset.length === 0) {
      window.showStatusMessage("请至少选择一种字符类型", "error");
      return;
    }

    // 生成密码
    let password = "";

    // 先添加必需的字符
    for (const char of required) {
      password += char;
    }

    // 填充剩余长度
    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
      password += this.getRandomChar(charset);
    }

    // 打乱密码顺序
    password = this.shuffleString(password);

    this.outputEl.value = password;

    // 默认隐藏密码
    if (!this.isVisible) {
      this.outputEl.type = "password";
    }

    window.showStatusMessage("密码已生成！", "success");
  },

  /**
   * 获取随机字符
   */
  getRandomChar(charset) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return charset[array[0] % charset.length];
  },

  /**
   * 打乱字符串
   */
  shuffleString(str) {
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const j = array[0] % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  },

  /**
   * 复制密码
   */
  async copy() {
    const password = this.outputEl.value;

    if (!password) {
      window.showStatusMessage("没有可复制的密码", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      window.showStatusMessage("密码已复制到剪贴板！", "success");
    } catch (error) {
      window.showStatusMessage("复制失败", "error");
    }
  },

  /**
   * 切换密码可见性
   */
  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.outputEl.type = this.isVisible ? "text" : "password";
    this.toggleBtn.textContent = this.isVisible ? "隐藏" : "显示";
  },
};

window.PasswordTool = PasswordTool;


