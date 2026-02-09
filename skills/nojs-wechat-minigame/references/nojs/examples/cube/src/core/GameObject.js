/**
 * GameObject 基类 - 引擎无关
 * 
 * 适用场景：
 * - 数量较少（< 20 个）
 * - 行为复杂的游戏对象（玩家、Boss、管理器等）
 * 
 * 生命周期：
 * 1. constructor() - 创建对象
 * 2. init() - 初始化（可选）
 * 3. update(dt) - 每帧更新
 * 4. destroy() - 销毁对象
 */
class GameObject {
  constructor() {
    // 显示对象（Pixi.Container 或 Three.Object3D）
    // 由子类根据渲染引擎初始化
    this.displayObject = null;
    
    // 状态
    this.isDestroyed = false;
  }

  /**
   * 初始化（子类实现）
   */
  init() {
    // 子类实现
  }

  /**
   * 每帧更新（子类实现）
   * @param {number} dt - 距离上一帧的时间（毫秒）
   */
  update(dt) {
    // 子类实现
  }

  /**
   * 销毁对象
   */
  destroy() {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    
    // 清理显示对象
    if (this.displayObject) {
      // Pixi: displayObject.destroy()
      // Three: 需要清理 geometry、material、texture
      if (this.displayObject.destroy) {
        this.displayObject.destroy({ children: true });
      }
      this.displayObject = null;
    }
    
    // 子类清理
    this.cleanup();
  }

  /**
   * 清理资源（子类重写）
   */
  cleanup() {
    // 子类实现：清理事件监听、定时器等
  }

  /**
   * 获取位置
   * @returns {Object} { x, y } 或 { x, y, z }
   */
  getPosition() {
    if (!this.displayObject) return { x: 0, y: 0 };
    
    return {
      x: this.displayObject.position.x,
      y: this.displayObject.position.y,
      z: this.displayObject.position.z || 0
    };
  }

  /**
   * 设置位置
   * @param {number} x
   * @param {number} y
   * @param {number} z - 3D 场景需要
   */
  setPosition(x, y, z = 0) {
    if (!this.displayObject) return;
    
    this.displayObject.position.x = x;
    this.displayObject.position.y = y;
    if (this.displayObject.position.z !== undefined) {
      this.displayObject.position.z = z;
    }
  }
}

export default GameObject;
