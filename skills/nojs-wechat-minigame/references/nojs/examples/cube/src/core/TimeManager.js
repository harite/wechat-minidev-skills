/**
 * 时间管理器
 * 
 * 职责：
 * 1. 全局暂停/恢复
 * 2. 时间缩放（慢动作/快进）
 * 3. 统一的 deltaTime 管理
 */
class TimeManager {
  constructor() {
    // 时间缩放（1.0 = 正常速度，0.5 = 慢动作，2.0 = 快进）
    this.timeScale = 1.0;
    
    // 暂停状态
    this.isPaused = false;
    
    // 当前帧的 deltaTime（毫秒）
    this.deltaTime = 0;
    
    // 游戏运行总时间（毫秒，不受暂停影响）
    this.totalTime = 0;
    
    // 游戏运行总时间（毫秒，受暂停影响）
    this.gameTime = 0;
  }

  /**
   * 更新时间（由 Game 主循环调用）
   * @param {number} rawDt - 原始帧间隔（毫秒）
   */
  update(rawDt) {
    this.totalTime += rawDt;
    
    if (this.isPaused) {
      this.deltaTime = 0;
      return;
    }
    
    this.deltaTime = rawDt * this.timeScale;
    this.gameTime += this.deltaTime;
  }

  /**
   * 获取当前帧的 deltaTime（已应用时间缩放和暂停）
   * @returns {number} 毫秒
   */
  getDeltaTime() {
    return this.deltaTime;
  }

  /**
   * 暂停游戏
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * 恢复游戏
   */
  resume() {
    this.isPaused = false;
  }

  /**
   * 切换暂停状态
   */
  togglePause() {
    this.isPaused = !this.isPaused;
  }

  /**
   * 设置时间缩放
   * @param {number} scale - 时间缩放比例（0.5 = 慢动作，2.0 = 快进）
   */
  setTimeScale(scale) {
    this.timeScale = Math.max(0, scale);
  }

  /**
   * 获取时间缩放
   * @returns {number}
   */
  getTimeScale() {
    return this.timeScale;
  }

  /**
   * 检查是否暂停
   * @returns {boolean}
   */
  isPausedState() {
    return this.isPaused;
  }

  /**
   * 重置时间管理器
   */
  reset() {
    this.timeScale = 1.0;
    this.isPaused = false;
    this.deltaTime = 0;
    this.totalTime = 0;
    this.gameTime = 0;
  }
}

// 单例导出
export default new TimeManager();
