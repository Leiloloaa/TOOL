// 翻译工具模块

const Translator = {
  sourceTextEl: null,
  targetTextEl: null,
  translateBtn: null,
  clearBtn: null,
  
  /**
   * 初始化翻译工具
   */
  init() {
    this.sourceTextEl = document.getElementById('source-text');
    this.targetTextEl = document.getElementById('target-text');
    this.translateBtn = document.getElementById('translate-btn');
    this.clearBtn = document.getElementById('clear-btn');
    
    if (!this.sourceTextEl || !this.targetTextEl || !this.translateBtn || !this.clearBtn) {
      console.error('翻译工具元素未找到');
      return;
    }
    
    // 绑定事件
    this.translateBtn.addEventListener('click', () => this.translate());
    this.clearBtn.addEventListener('click', () => this.clear());
    
    // 支持回车快捷键（Ctrl/Cmd + Enter）
    this.sourceTextEl.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.translate();
      }
    });
    
    // 自动聚焦到输入框
    this.sourceTextEl.focus();
  },
  
  /**
   * 执行翻译
   */
  async translate() {
    const sourceText = this.sourceTextEl.value.trim();
    
    if (!sourceText) {
      window.showStatusMessage('请输入要翻译的中文内容', 'error');
      return;
    }
    
    // 禁用按钮，显示加载状态
    this.translateBtn.disabled = true;
    this.translateBtn.textContent = '翻译中...';
    window.showStatusMessage('正在翻译，请稍候...', 'loading', 0);
    
    try {
      const translatedText = await this.translateText(sourceText);
      this.targetTextEl.value = translatedText;
      window.showStatusMessage('翻译完成！', 'success');
    } catch (error) {
      console.error('翻译失败:', error);
      window.showStatusMessage(`翻译失败: ${error.message}`, 'error');
      this.targetTextEl.value = '';
    } finally {
      // 恢复按钮状态
      this.translateBtn.disabled = false;
      this.translateBtn.textContent = '翻译';
      window.hideStatusMessage();
    }
  },
  
  /**
   * 调用翻译 API
   * @param {string} text - 要翻译的文本
   * @returns {Promise<string>} 翻译结果
   */
  async translateText(text) {
    // 使用 Google Translate 的免费 API 端点
    // 注意：这是非官方 API，可能不稳定，生产环境建议使用官方 API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 解析返回的数据结构
      if (data && data[0] && Array.isArray(data[0])) {
        // 提取所有翻译片段并拼接
        const translatedParts = data[0]
          .filter(item => item[0])
          .map(item => item[0]);
        return translatedParts.join('');
      }
      
      throw new Error('无法解析翻译结果');
    } catch (error) {
      // 如果网络请求失败，尝试备用方案
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        // 使用备用翻译方法（通过 MyMemory API）
        return await this.translateTextFallback(text);
      }
      throw error;
    }
  },
  
  /**
   * 备用翻译方法（使用 MyMemory Translation API）
   * @param {string} text - 要翻译的文本
   * @returns {Promise<string>} 翻译结果
   */
  async translateTextFallback(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh|en`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`翻译服务不可用: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData) {
      return data.responseData.translatedText;
    }
    
    throw new Error(data.responseData?.error || '翻译失败');
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

