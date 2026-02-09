/**
 * 全局事件总线
 * 用于跨场景、跨模块通信
 */
class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * 监听事件
   * @param {string} event - 事件名，推荐格式：domain:action
   * @param {Function} handler - 事件处理函数
   * @param {Object} context - 绑定的上下文（可选）
   */
  on(event, handler, context = null) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push({ handler, context });
  }

  /**
   * 取消监听事件
   * @param {string} event - 事件名
   * @param {Function} handler - 要移除的处理函数（可选，不传则移除该事件的所有监听）
   */
  off(event, handler = null) {
    if (!this.events.has(event)) return;

    if (handler === null) {
      this.events.delete(event);
    } else {
      const listeners = this.events.get(event);
      const index = listeners.findIndex(l => l.handler === handler);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length === 0) {
        this.events.delete(event);
      }
    }
  }

  /**
   * 触发事件
   * @param {string} event - 事件名
   * @param {...any} args - 传递给处理函数的参数
   */
  emit(event, ...args) {
    if (!this.events.has(event)) return;

    const listeners = this.events.get(event);
    for (const { handler, context } of listeners) {
      handler.apply(context, args);
    }
  }

  /**
   * 监听一次性事件
   * @param {string} event - 事件名
   * @param {Function} handler - 事件处理函数
   * @param {Object} context - 绑定的上下文（可选）
   */
  once(event, handler, context = null) {
    const onceHandler = (...args) => {
      handler.apply(context, args);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  /**
   * 清空所有事件监听
   */
  clear() {
    this.events.clear();
  }
}

// 单例导出
export default new EventBus();
