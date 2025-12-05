// 主入口文件 - 管理工具切换和初始化

document.addEventListener('DOMContentLoaded', () => {
  // 初始化工具标签切换
  initToolTabs();
  
  // 初始化翻译工具
  if (typeof Translator !== 'undefined') {
    Translator.init();
  }
  
  // 初始化小驼峰转换工具
  if (typeof CamelCase !== 'undefined') {
    CamelCase.init();
  }
  
  // 初始化二维码生成工具
  if (typeof QRCodeTool !== 'undefined') {
    QRCodeTool.init();
  }
});

/**
 * 初始化工具标签切换功能
 */
function initToolTabs() {
  const tabs = document.querySelectorAll('.tool-tab');
  const panels = document.querySelectorAll('.tool-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const toolName = tab.getAttribute('data-tool');
      
      // 移除所有活动状态
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // 激活当前标签和面板
      tab.classList.add('active');
      const targetPanel = document.getElementById(`${toolName}-tool`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        
        // 如果切换到二维码工具，触发自动获取当前页面
        if (toolName === 'qrcode' && typeof QRCodeTool !== 'undefined') {
          // 延迟一下，确保面板已经显示，然后实时获取
          setTimeout(() => {
            if (!QRCodeTool.isManualInput || !QRCodeTool.urlInputEl.value.trim()) {
              QRCodeTool.isManualInput = false;
              // 实时获取当前页面 URL
              QRCodeTool.getCurrentUrl();
            }
          }, 150);
        }
      }
    });
  });
}

/**
 * 显示状态消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: 'success', 'error', 'loading'
 * @param {number} duration - 显示时长（毫秒），0 表示不自动隐藏
 */
function showStatusMessage(message, type = 'success', duration = 3000) {
  // 尝试在当前活动的工具面板中显示状态消息
  const activePanel = document.querySelector('.tool-panel.active');
  if (!activePanel) return;
  
  // 查找当前面板中的状态消息元素
  let statusEl = activePanel.querySelector('.status-message');
  if (!statusEl) {
    // 如果没有找到，尝试使用通用的状态消息元素
    statusEl = document.getElementById('status-message');
  }
  
  if (!statusEl) return;
  
  statusEl.textContent = message;
  statusEl.className = `status-message show ${type}`;
  
  if (duration > 0) {
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, duration);
  }
}

/**
 * 隐藏状态消息
 */
function hideStatusMessage() {
  // 隐藏所有状态消息
  const statusMessages = document.querySelectorAll('.status-message');
  statusMessages.forEach(el => {
    el.classList.remove('show');
  });
}

// 导出给工具模块使用
window.showStatusMessage = showStatusMessage;
window.hideStatusMessage = hideStatusMessage;

