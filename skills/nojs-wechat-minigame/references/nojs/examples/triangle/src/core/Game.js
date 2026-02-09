import SceneManager from './SceneManager';
import InputManager from './InputManager';
import TimeManager from './TimeManager';

/**
 * 游戏主循环
 * 职责：管理游戏生命周期、驱动场景更新
 */
class Game {
  constructor() {
    this.sceneManager = new SceneManager();
    this.lastTime = 0;
    this.isRunning = false;
  }

  /**
   * 启动游戏
   * @param {Class} FirstSceneClass - 首个场景类（通常是 LoadingScene）
   * @param {Object} params - 场景参数
   */
  start(FirstSceneClass, params = {}) {
    if (this.isRunning) {
      console.warn('Game already started');
      return;
    }

    // 启动输入管理器
    InputManager.startListening();

    // 启动首个场景
    this.sceneManager.start(FirstSceneClass, params);

    // 启动主循环
    this.isRunning = true;
    this.lastTime = Date.now();
    this._loop();
  }

  /**
   * 主循环
   * @private
   */
  _loop() {
    if (!this.isRunning) return;

    const now = Date.now();
    const rawDt = now - this.lastTime;
    this.lastTime = now;

    // 更新时间管理器
    TimeManager.update(rawDt);
    const dt = TimeManager.getDeltaTime();

    // 执行场景切换（如果有待切换的场景）
    this.sceneManager.performSwitch();

    // 更新当前场景（使用经过时间缩放和暂停处理的 dt）
    this.sceneManager.update(dt);

    // 下一帧
    requestAnimationFrame(() => this._loop());
  }

  /**
   * 停止游戏
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * 获取场景管理器
   * @returns {SceneManager}
   */
  getSceneManager() {
    return this.sceneManager;
  }
}

export default Game;
