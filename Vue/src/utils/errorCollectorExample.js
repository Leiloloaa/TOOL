/**
 * ConsoleErrorCollector 使用示例和文档
 *
 * 这是一个独立可配置的错误收集模块，用于收集和记录控制台错误。
 * 支持多种错误类型监听，自动保存，活动ID关联，发送模式配置等功能。
 *
 * 主要特性：
 * - 支持监听 console.error, console.warn, JavaScript 错误, Promise 拒绝
 * - 可配置的监听目标和参数
 * - 使用 sessionStorage 存储错误信息
 * - 支持活动ID关联
 * - 支持自动和手动检查
 * - 支持立即发送和批量发送两种模式
 * - 支持错误合并，减少重复错误
 * - 支持服务器状态管理和智能停止
 *
 * 使用方法：
 * 1. 导入模块：import ConsoleErrorCollector from "./ConsoleErrorCollector.js"
 * 2. 创建实例：const collector = new ConsoleErrorCollector(config)
 * 3. 启动收集：collector.start()
 * 4. 获取错误：collector.getErrors()
 *
 * 配置选项：
 * - targets: 监听的对象类型数组 ['console.error', 'console.warn', 'javascript', 'promise']
 * - autoStart: 是否自动开始监听 (默认: false)
 * - interval: 自动检查间隔（毫秒）(默认: 300000)
 * - maxErrors: 最大收集错误数量 (默认: 100)
 * - onError: 错误回调函数 (默认: null)
 * - activityId: 活动ID，用于标识错误来源 (默认: null)
 * - useSessionStorage: 是否使用 sessionStorage 存储 (默认: true)
 * - storageKey: sessionStorage 存储键名 (默认: 'console_error_collector')
 * - sendMode: 发送模式 'immediate' | 'batch' (默认: 'immediate', immediate: 立即发送, batch: 批量发送)
 * - batchInterval: 批量发送间隔（毫秒）(默认: 120000)
 *
 * 示例代码：
 *
 * // 基础使用 - 立即发送模式
 * const collector = new ConsoleErrorCollector({
 *   targets: ["console.error", "console.warn"],
 *   autoStart: true,
 *   maxErrors: 50,
 *   sendMode: "immediate"
 * });
 *
 * // 批量发送模式 - 错误合并
 * const batchCollector = new ConsoleErrorCollector({
 *   targets: ["console.error", "console.warn", "javascript", "promise"],
 *   autoStart: true,
 *   maxErrors: 100,
 *   sendMode: "batch",
 *   batchInterval: 2 * 60 * 1000, // 2分钟
 *   activityId: "USER_SESSION_123",
 *   useSessionStorage: true,
 *   storageKey: "my_app_errors",
 *   onError: (error) => {
 *     console.log("收到新错误:", error);
 *   }
 * });
 *
 * // 设置服务器接口
 * batchCollector.setServerUrl("https://your-api-server.com/api/errors");
 *
 * // 启动收集
 * batchCollector.start();
 *
 * // 手动检查
 * batchCollector.manualCheck();
 *
 * // 获取错误
 * const errors = batchCollector.getErrors();
 *
 * // 获取统计信息
 * const stats = batchCollector.getStats();
 *
 * // 获取状态信息
 * const status = batchCollector.getStatus();
 * console.log("发送模式:", status.sendMode);
 * console.log("待发送错误:", status.pendingErrorsCount);
 * console.log("批量定时器:", status.batchTimerActive);
 *
 * // 发送模式控制
 * batchCollector.setSendMode("immediate"); // 切换到立即模式
 * batchCollector.setSendMode("batch");     // 切换到批量模式
 *
 * // 手动发送批量错误
 * batchCollector.sendBatchNow();
 *
 * // 服务器状态管理
 * batchCollector.resetServerStatus(); // 重置服务器状态
 *
 * // 清理
 * batchCollector.clearErrors();
 * batchCollector.destroy();
 *
 * 发送模式说明：
 *
 * 1. 立即发送模式 (immediate)：
 *    - 捕获到错误后立即发送到服务器
 *    - 每个错误单独发送
 *    - 适合需要实时监控的场景
 *
 * 2. 批量发送模式 (batch)：
 *    - 捕获到错误后存储到 sessionStorage
 *    - 按配置的间隔时间批量发送
 *    - 相同错误会合并，增加计数
 *    - 适合减少服务器压力的场景
 *
 * 错误合并机制：
 * - 相同类型和内容的错误会被合并
 * - 记录错误出现次数 (count)
 * - 记录首次和最后出现时间
 * - 发送时包含合并后的信息
 * - 发送成功后标记错误为已发送（isSent: true）
 * - 只处理未发送的错误，避免重复发送
 *
 * 服务器状态管理：
 * - 自动检测服务器可用性
 * - 发送失败时自动停止后续发送
 * - 支持手动重置服务器状态
 * - 避免无限重试和资源浪费
 *
 * 注意事项：
 * - 确保在页面卸载前调用 destroy() 方法清理资源
 * - 活动ID用于区分不同会话或用户的错误
 * - 错误信息会自动截断过长的内容
 * - 错误信息使用 sessionStorage 存储，页面关闭后数据会丢失，但页面刷新后数据会保留
 * - 批量模式下，相同错误会合并，减少重复发送
 * - 服务器不可用时，错误仍会收集到本地存储
 *
 * 错误类型说明：
 * - console.error: 控制台错误信息
 * - console.warn: 控制台警告信息
 * - JavaScript Error: 未捕获的JavaScript错误
 * - Promise Rejection: 未处理的Promise拒绝
 *
 * 打印格式：
 * 错误信息会以精炼的格式打印到控制台：
 * 🚨 [错误类型] 错误内容 | 时间 | URL
 *
 * 例如：
 * 🚨 [console.error] 这是一个测试错误 | 8.03 17:30:45 | http://localhost:3001
 *
 * 批量发送示例：
 * 📦 批量发送定时器已启动，120秒后发送
 * 📦 开始发送批量错误，共 3 个不同的错误
 * ✅ 批量错误已发送: console.error (5次)
 * ✅ 批量错误已发送: JavaScript Error (2次)
 * ✅ 批量错误已发送: console.warn (1次)
 */
