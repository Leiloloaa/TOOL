// 小驼峰转换工具模块

const CamelCase = {
  sourceTextEl: null,
  targetTextEl: null,
  convertBtn: null,
  clearBtn: null,
  
  /**
   * 初始化小驼峰转换工具
   */
  init() {
    this.sourceTextEl = document.getElementById('camelcase-source-text');
    this.targetTextEl = document.getElementById('camelcase-target-text');
    this.convertBtn = document.getElementById('camelcase-convert-btn');
    this.clearBtn = document.getElementById('camelcase-clear-btn');
    
    if (!this.sourceTextEl || !this.targetTextEl || !this.convertBtn || !this.clearBtn) {
      console.error('小驼峰转换工具元素未找到');
      return;
    }
    
    // 绑定事件
    this.convertBtn.addEventListener('click', () => this.convert());
    this.clearBtn.addEventListener('click', () => this.clear());
    
    // 支持实时转换（输入时自动转换）
    this.sourceTextEl.addEventListener('input', () => {
      this.autoConvert();
    });
    
    // 支持回车快捷键（Ctrl/Cmd + Enter）
    this.sourceTextEl.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.convert();
      }
    });
    
    // 自动聚焦到输入框
    this.sourceTextEl.focus();
  },
  
  /**
   * 自动转换（输入时触发）
   */
  async autoConvert() {
    const sourceText = this.sourceTextEl.value.trim();
    
    if (!sourceText) {
      this.targetTextEl.value = '';
      return;
    }
    
    const camelCaseText = this.toCamelCase(sourceText);
    this.targetTextEl.value = camelCaseText;
  },
  
  /**
   * 执行转换并复制到剪贴板
   */
  async convert() {
    const sourceText = this.sourceTextEl.value.trim();
    
    if (!sourceText) {
      window.showStatusMessage('请输入要转换的文本', 'error');
      return;
    }
    
    const camelCaseText = this.toCamelCase(sourceText);
    this.targetTextEl.value = camelCaseText;
    
    // 复制到剪贴板
    try {
      await this.copyToClipboard(camelCaseText);
      window.showStatusMessage('已转换为小驼峰并复制到剪贴板！', 'success');
    } catch (error) {
      console.error('复制失败:', error);
      window.showStatusMessage(`转换成功，但复制失败: ${error.message}`, 'error');
    }
  },
  
  /**
   * 将文本转换为小驼峰格式
   * @param {string} text - 要转换的文本
   * @returns {string} 小驼峰格式的文本
   */
  toCamelCase(text) {
    if (!text) return '';
    
    // 处理各种分隔符：空格、连字符、下划线、点号等
    // 将文本分割成单词数组
    const words = text
      .trim()
      // 替换各种分隔符为空格
      .replace(/[-_\s.]+/g, ' ')
      // 按空格分割
      .split(/\s+/)
      // 过滤空字符串
      .filter(word => word.length > 0)
      // 处理每个单词：移除特殊字符，只保留字母和数字
      .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
      .filter(word => word.length > 0);
    
    if (words.length === 0) return '';
    
    // 第一个单词全小写
    const firstWord = words[0].toLowerCase();
    
    // 后续单词首字母大写，其余小写
    const restWords = words.slice(1).map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    
    return firstWord + restWords.join('');
  },
  
  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<void>}
   */
  async copyToClipboard(text) {
    // 使用 Clipboard API（需要权限）
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // 如果 Clipboard API 失败，使用备用方法
        console.warn('Clipboard API 失败，使用备用方法:', error);
      }
    }
    
    // 备用方法：使用传统的 execCommand
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (!successful) {
        throw new Error('execCommand 复制失败');
      }
    } catch (error) {
      document.body.removeChild(textArea);
      throw error;
    }
  },
  
  /**
   * 清空输入和输出
   */
  clear() {
    this.sourceTextEl.value = '';
    this.targetTextEl.value = '';
    this.sourceTextEl.focus();
    window.hideStatusMessage();
  }
};

