/**
 * 对象池
 * 
 * 职责：
 * 1. 复用频繁创建/销毁的对象
 * 2. 减少 GC 压力，提升性能
 * 
 * 适用场景：
 * - 子弹、粒子等大量生成的对象
 * - 敌人、道具等频繁创建销毁的对象
 * 
 * 使用示例：
 * ```javascript
 * // 创建子弹对象池
 * const bulletPool = new ObjectPool(() => new Bullet(), 20);
 * 
 * // 获取子弹
 * const bullet = bulletPool.acquire();
 * bullet.init(x, y);
 * 
 * // 归还子弹
 * bulletPool.release(bullet);
 * ```
 */
class ObjectPool {
  /**
   * 创建对象池
   * @param {Function} factory - 对象工厂函数，返回新对象
   * @param {number} initialSize - 初始对象数量（预创建）
   */
  constructor(factory, initialSize = 10) {
    if (typeof factory !== 'function') {
      throw new Error('ObjectPool: factory must be a function');
    }
    
    this.factory = factory;
    
    // 可用对象池
    this.pool = [];
    
    // 活跃对象列表
    this.active = [];
    
    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }

  /**
   * 获取对象
   * @returns {Object} 对象实例
   */
  acquire() {
    let obj;
    
    if (this.pool.length > 0) {
      // 从池中获取
      obj = this.pool.pop();
    } else {
      // 池为空，创建新对象
      obj = this.factory();
    }
    
    this.active.push(obj);
    return obj;
  }

  /**
   * 归还对象
   * @param {Object} obj - 要归还的对象
   */
  release(obj) {
    const index = this.active.indexOf(obj);
    
    if (index !== -1) {
      this.active.splice(index, 1);
      
      // 重置对象状态（如果有 reset 方法）
      if (typeof obj.reset === 'function') {
        obj.reset();
      }
      
      this.pool.push(obj);
    }
  }

  /**
   * 批量归还对象
   * @param {Array} objects - 要归还的对象数组
   */
  releaseAll(objects) {
    for (const obj of objects) {
      this.release(obj);
    }
  }

  /**
   * 获取池中可用对象数量
   * @returns {number}
   */
  getAvailableCount() {
    return this.pool.length;
  }

  /**
   * 获取活跃对象数量
   * @returns {number}
   */
  getActiveCount() {
    return this.active.length;
  }

  /**
   * 获取所有活跃对象
   * @returns {Array}
   */
  getActiveObjects() {
    return this.active.slice();
  }

  /**
   * 清空对象池
   * 注意：会销毁所有对象（如果对象有 destroy 方法）
   */
  clear() {
    // 销毁活跃对象
    for (const obj of this.active) {
      if (typeof obj.destroy === 'function') {
        obj.destroy();
      }
    }
    
    // 销毁池中对象
    for (const obj of this.pool) {
      if (typeof obj.destroy === 'function') {
        obj.destroy();
      }
    }
    
    this.active = [];
    this.pool = [];
  }

  /**
   * 预分配对象（扩充池大小）
   * @param {number} count - 要预创建的对象数量
   */
  preallocate(count) {
    for (let i = 0; i < count; i++) {
      this.pool.push(this.factory());
    }
  }
}

export default ObjectPool;
