# Chrome扩展工具

这个目录包含Chrome浏览器扩展相关的开发工具和插件。

## 目录说明

- 存放Chrome扩展的源代码和配置文件
- 提供浏览器开发辅助功能
- 支持网页开发和调试工具

## Chrome扩展开发

### 基本结构
```
chorme/
├── manifest.json    # 扩展清单文件
├── popup.html       # 弹出页面
├── content.js       # 内容脚本
├── background.js    # 后台脚本
├── options.html     # 选项页面
└── icons/           # 扩展图标
```

### 开发环境设置

1. **启用开发者模式**
   - 打开Chrome浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"

2. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择此目录

3. **调试扩展**
   - 使用Chrome DevTools调试
   - 查看控制台输出
   - 检查扩展权限

### 开发工具

- **Chrome DevTools**: 调试扩展和网页
- **Extension API**: Chrome扩展开发API
- **Manifest V3**: 最新扩展清单格式

## 功能特性

- 🔧 网页开发辅助工具
- 🐛 调试和测试功能
- 🎨 界面增强工具
- 📊 数据分析和监控
- 🔒 安全和隐私保护

## 开发指南

### 创建新扩展
1. 创建 `manifest.json` 文件
2. 定义扩展基本信息
3. 配置权限和功能
4. 开发核心功能代码
5. 测试和调试

### 发布扩展
1. 准备扩展包
2. 创建开发者账号
3. 上传到Chrome Web Store
4. 等待审核通过

## 注意事项

- 遵循Chrome扩展开发规范
- 注意权限申请的最小化原则
- 确保扩展的安全性和稳定性
- 定期更新和维护

## 相关资源

- [Chrome扩展开发文档](https://developer.chrome.com/docs/extensions/)
- [Manifest V3指南](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Web Store发布指南](https://developer.chrome.com/docs/webstore/)

---

**提示**: 开发Chrome扩展时，请确保遵循Google的开发者政策和最佳实践。
