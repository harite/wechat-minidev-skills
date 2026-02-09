/**
 * 屏幕适配工具
 * 
 * 职责：
 * 1. 设计分辨率到物理分辨率的转换
 * 2. 刘海屏安全区域处理
 * 3. 适配不同设备屏幕尺寸
 * 
 * 使用场景：
 * - 设计稿基于 750x1334（iPhone 6/7/8 标准）
 * - 运行时需要适配到实际设备分辨率
 */
class ScreenAdapter {
  constructor(designWidth = 750, designHeight = 1334) {
    this.designWidth = designWidth;
    this.designHeight = designHeight;
    
    // 获取设备信息
    const sysInfo = wx.getSystemInfoSync();
    this.screenWidth = sysInfo.screenWidth;
    this.screenHeight = sysInfo.screenHeight;
    this.pixelRatio = sysInfo.pixelRatio || 1;
    this.safeArea = sysInfo.safeArea;
    
    // 计算缩放比例
    this.scaleX = this.screenWidth / this.designWidth;
    this.scaleY = this.screenHeight / this.designHeight;
    
    // 使用等比缩放（保持宽高比）
    this.scale = Math.min(this.scaleX, this.scaleY);
    
    // 计算实际显示区域（居中）
    this.offsetX = (this.screenWidth - this.designWidth * this.scale) / 2;
    this.offsetY = (this.screenHeight - this.designHeight * this.scale) / 2;
  }

  /**
   * 设计坐标转换为屏幕坐标
   * @param {number} x - 设计稿 x 坐标
   * @param {number} y - 设计稿 y 坐标
   * @returns {Object} { x, y } 屏幕坐标
   */
  toScreen(x, y) {
    return {
      x: x * this.scale + this.offsetX,
      y: y * this.scale + this.offsetY
    };
  }

  /**
   * 屏幕坐标转换为设计坐标
   * @param {number} x - 屏幕 x 坐标
   * @param {number} y - 屏幕 y 坐标
   * @returns {Object} { x, y } 设计坐标
   */
  toDesign(x, y) {
    return {
      x: (x - this.offsetX) / this.scale,
      y: (y - this.offsetY) / this.scale
    };
  }

  /**
   * 设计尺寸转换为屏幕尺寸
   * @param {number} size - 设计稿尺寸
   * @returns {number} 屏幕尺寸
   */
  toScreenSize(size) {
    return size * this.scale;
  }

  /**
   * 屏幕尺寸转换为设计尺寸
   * @param {number} size - 屏幕尺寸
   * @returns {number} 设计尺寸
   */
  toDesignSize(size) {
    return size / this.scale;
  }

  /**
   * 获取屏幕宽度
   * @returns {number}
   */
  getScreenWidth() {
    return this.screenWidth;
  }

  /**
   * 获取屏幕高度
   * @returns {number}
   */
  getScreenHeight() {
    return this.screenHeight;
  }

  /**
   * 获取设计宽度
   * @returns {number}
   */
  getDesignWidth() {
    return this.designWidth;
  }

  /**
   * 获取设计高度
   * @returns {number}
   */
  getDesignHeight() {
    return this.designHeight;
  }

  /**
   * 获取缩放比例
   * @returns {number}
   */
  getScale() {
    return this.scale;
  }

  /**
   * 获取安全区域（刘海屏适配）
   * @returns {Object} { top, bottom, left, right, width, height }
   */
  getSafeArea() {
    return this.safeArea;
  }

  /**
   * 检查坐标是否在安全区域内
   * @param {number} x - 屏幕 x 坐标
   * @param {number} y - 屏幕 y 坐标
   * @returns {boolean}
   */
  isInSafeArea(x, y) {
    if (!this.safeArea) return true;
    
    return x >= this.safeArea.left &&
           x <= this.safeArea.right &&
           y >= this.safeArea.top &&
           y <= this.safeArea.bottom;
  }

  /**
   * 获取设备像素比
   * @returns {number}
   */
  getPixelRatio() {
    return this.pixelRatio;
  }
}

// 单例导出（使用默认设计分辨率 750x1334）
export default new ScreenAdapter(750, 1334);
