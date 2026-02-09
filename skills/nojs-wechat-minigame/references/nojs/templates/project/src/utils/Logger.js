/**
 * 高性能日志库
 * 封装: console + getLogManager + getGameLogManager
 * 特性:
 * 1. 所有日志统一通过Logger记录
 * 2. getGameLogManager实时上报(新版实时日志)
 * 3. 支持日志级别控制,低于当前级别的日志不会执行(通过构建时转换实现)
 */

const LOG_LEVELS = {
  debug: 0,
  log: 1,
  info: 2,
  impt: 3,  // important - 重要日志
  warn: 4,
  error: 5
};

class LoggerManager {
  constructor() {
    this.logManager = null;
    this.gameLogManager = null;
    this.currentLevel = LOG_LEVELS.debug;
    
    this._init();
  }

  _init() {
    if (typeof wx !== 'undefined') {
      // 普通日志管理器
      this.logManager = wx.getLogManager({ level: 0 });
      
      // 游戏日志管理器(新版实时日志)
      if (wx.getGameLogManager) {
        const logger = wx.getGameLogManager({
          commonInfo: {
            version: typeof __GAME_VERSION__ !== 'undefined' ? __GAME_VERSION__ : '1.0.0'
          }
        });
        if (logger.tag) {
            this.gameLogManager = logger.tag('log');
        }
      }
    }
  }

  setLevel(level) {
    if (LOG_LEVELS.hasOwnProperty(level)) {
      this.currentLevel = LOG_LEVELS[level];
    }
  }

  needLog(level) {
    const levelValue = LOG_LEVELS[level];
    return levelValue !== undefined && levelValue >= this.currentLevel;
  }

  _formatMessage(file, line, func, ...args) {
    const prefix = `[${file}:${line}${func ? `@${func}` : ''}]`;
    return [prefix, ...args];
  }

  debug(file, line, func, ...args) {
    const msg = this._formatMessage(file, line, func, ...args);
    console.debug(...msg);
    if (this.logManager) this.logManager.debug(...msg);
  }

  log(file, line, func, ...args) {
    const msg = this._formatMessage(file, line, func, ...args);
    console.log(...msg);
    if (this.logManager) this.logManager.log(...msg);
  }

  info(file, line, func, ...args) {
    const msg = this._formatMessage(file, line, func, ...args);
    console.info(...msg);
    if (this.logManager) this.logManager.info(...msg);
  }

  impt(file, line, func, ...args) {
    const msg = this._formatMessage(file, line, func, ...args);
    console.info(...msg);
    if (this.logManager) this.logManager.info(...msg);
    if (this.gameLogManager) this.gameLogManager.info(...msg);
  }

  warn(file, line, func, ...args) {
    const msg = this._formatMessage(file, line, func, ...args);
    console.warn(...msg);
    if (this.logManager) this.logManager.warn(...msg);
  }

  error(file, line, func, ...args) {
    const msg = this._formatMessage(file, line, func, ...args);
    console.error(...msg);
    if (this.logManager) this.logManager.error(...msg);
    if (this.gameLogManager) this.gameLogManager.error(...msg);
  }
}

// 创建全局单例
const Logger = new LoggerManager();

// 挂载到全局,使其像console一样可以直接使用
if (typeof global !== 'undefined') {
  global.Logger = Logger;
}
if (typeof window !== 'undefined') {
  window.Logger = Logger;
}

export default Logger;
