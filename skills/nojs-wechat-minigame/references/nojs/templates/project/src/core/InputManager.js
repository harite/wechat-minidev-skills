/**
 * 输入管理器 - 解决事件穿透问题
 * 
 * 核心机制：
 * 1. 拦截层级管理：通过栈结构管理事件拦截层
 * 2. 模态对话框：push 拦截层阻止事件穿透到下层
 * 3. 场景切换：自动清理旧场景的拦截层
 */
class InputManager {
  constructor() {
    // 拦截层栈：栈顶的层会拦截所有输入事件
    this.blockLayers = [];
    
    // 当前激活的输入处理器（与 Scene 绑定）
    this.activeHandlers = new Map();
    
    // 全局输入事件监听状态
    this.isListening = false;
  }

  /**
   * 启动输入监听（Game 初始化时调用）
   */
  startListening() {
    if (this.isListening) return;
    
    const canvas = GameGlobal.screencanvas;
    
    // 触摸事件
    canvas.addEventListener('touchstart', this._handleTouchStart.bind(this));
    canvas.addEventListener('touchmove', this._handleTouchMove.bind(this));
    canvas.addEventListener('touchend', this._handleTouchEnd.bind(this));
    canvas.addEventListener('touchcancel', this._handleTouchCancel.bind(this));
    
    this.isListening = true;
  }

  /**
   * 推入拦截层（打开模态对话框时调用）
   * @param {string} layerId - 拦截层ID，用于后续移除
   * @returns {string} 返回 layerId
   */
  pushBlockLayer(layerId) {
    this.blockLayers.push(layerId);
    return layerId;
  }

  /**
   * 移除拦截层（关闭模态对话框时调用）
   * @param {string} layerId - 要移除的拦截层ID
   */
  popBlockLayer(layerId) {
    const index = this.blockLayers.indexOf(layerId);
    if (index !== -1) {
      this.blockLayers.splice(index, 1);
    }
  }

  /**
   * 清空所有拦截层（场景切换时调用）
   */
  clearBlockLayers() {
    this.blockLayers = [];
  }

  /**
   * 检查事件是否被拦截
   * @returns {boolean}
   */
  _isBlocked() {
    return this.blockLayers.length > 0;
  }

  /**
   * 注册场景的输入处理器
   * @param {string} sceneId - 场景ID
   * @param {Object} handlers - 事件处理器 { onTouchStart, onTouchMove, onTouchEnd }
   */
  registerScene(sceneId, handlers) {
    this.activeHandlers.set(sceneId, handlers);
  }

  /**
   * 注销场景的输入处理器
   * @param {string} sceneId - 场景ID
   */
  unregisterScene(sceneId) {
    this.activeHandlers.delete(sceneId);
  }

  /**
   * 分发事件到当前激活的场景
   * @private
   */
  _dispatchToActiveScene(eventName, event) {
    // 如果有拦截层，阻止事件传递到场景
    if (this._isBlocked()) {
      return;
    }

    // 分发给所有激活的场景（通常只有一个）
    // 兼容微信小游戏环境，使用forEach而非for-of
    this.activeHandlers.forEach((handlers) => {
      if (handlers[eventName]) {
        handlers[eventName](event);
      }
    });
  }

  _handleTouchStart(event) {
    this._dispatchToActiveScene('onTouchStart', event);
  }

  _handleTouchMove(event) {
    this._dispatchToActiveScene('onTouchMove', event);
  }

  _handleTouchEnd(event) {
    this._dispatchToActiveScene('onTouchEnd', event);
  }

  _handleTouchCancel(event) {
    this._dispatchToActiveScene('onTouchCancel', event);
  }
}

// 单例导出
export default new InputManager();
