/**
 * 微信分享管理工具
 * 
 * 由于微信小游戏的 shareAppMessage 不提供回调，
 * 本工具通过监听 onShow/onHide 来间接实现分享回调功能
 */

/**
 * 微信分享管理类
 */
class WechatShare {
  constructor() {
    this.isInitialized = false;
    this.defaultShareConfig = {
      title: '快来一起玩游戏！',
      query: 'from=share',
      // imageUrl: 'share.png', // 不设置则默认截取当前屏幕内容
    };

    // 分享回调检测相关
    this.pendingShareCallback = null;
    this.pendingShareCancelCallback = null;
    this.shareStartTime = 0;
    this.shareTimeout = 500; // 默认超时时间（毫秒）
    this.isListeningShowHide = false;
  }

  /**
   * 初始化分享功能
   */
  initialize() {
    if (this.isInitialized) {
      console.log('[WechatShare] 分享功能已初始化');
      return;
    }

    if (typeof wx === 'undefined') {
      console.warn('[WechatShare] 当前环境不支持微信API');
      return;
    }

    try {
      // 显示转发按钮
      this.showShareMenu();

      // 监听分享事件
      this.setupShareListeners();
      
      // 设置 onShow/onHide 监听（用于分享回调检测）
      this.setupShowHideListeners();

      this.isInitialized = true;
      console.log('[WechatShare] 微信分享功能初始化成功');
    } catch (error) {
      console.error('[WechatShare] 初始化分享功能失败:', error);
    }
  }

  /**
   * 显示分享菜单
   */
  showShareMenu() {
    if (!wx.showShareMenu) {
      console.warn('[WechatShare] 当前版本不支持 showShareMenu');
      return;
    }

    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
      success: function() {
        console.log('[WechatShare] 分享菜单已启用');
      },
      fail: function(err) {
        console.warn('[WechatShare] 启用分享菜单失败:', err);
      },
    });
  }

  /**
   * 设置分享监听器
   */
  setupShareListeners() {
    var self = this;
    
    // 分享给好友
    if (wx.onShareAppMessage) {
      wx.onShareAppMessage(function() {
        return self.getShareConfig('shareAppMessage');
      });
    }

    // 分享到朋友圈
    if (wx.onShareTimeline) {
      wx.onShareTimeline(function() {
        return self.getShareConfig('shareTimeline');
      });
    }
  }
  
  /**
   * 设置 onShow/onHide 监听器（用于分享回调检测）
   * 由于微信 shareAppMessage 不再提供回调，通过监听前后台切换来检测分享行为
   */
  setupShowHideListeners() {
    if (this.isListeningShowHide) return;
    
    if (typeof wx === 'undefined') return;
    
    var self = this;
    
    // 监听切到后台（分享时会触发）
    if (wx.onHide) {
      wx.onHide(function() {
        // 如果有待处理的分享回调，记录切到后台的时间
        if (self.pendingShareCallback) {
          self.shareStartTime = Date.now();
          console.log('[WechatShare] 检测到切换到后台，可能正在分享');
        }
      });
    }
    
    // 监听切回前台
    if (wx.onShow) {
      wx.onShow(function() {
        // 如果有待处理的分享回调
        if (self.pendingShareCallback) {
          var elapsed = Date.now() - self.shareStartTime;
          
          if (self.shareStartTime > 0 && elapsed >= self.shareTimeout) {
            // 切换到后台超过阈值时间，认为分享成功
            console.log('[WechatShare] 分享检测成功（后台停留 ' + elapsed + 'ms）');
            var callback = self.pendingShareCallback;
            self.clearPendingShare();
            callback();
          } else {
            // 切换时间太短，认为分享取消
            console.log('[WechatShare] 分享检测取消（后台停留 ' + elapsed + 'ms < ' + self.shareTimeout + 'ms）');
            var cancelCallback = self.pendingShareCancelCallback;
            self.clearPendingShare();
            if (cancelCallback) {
              cancelCallback();
            }
          }
        }
      });
    }
    
    this.isListeningShowHide = true;
    console.log('[WechatShare] onShow/onHide 监听已设置');
  }
  
  /**
   * 清除待处理的分享回调
   */
  clearPendingShare() {
    this.pendingShareCallback = null;
    this.pendingShareCancelCallback = null;
    this.shareStartTime = 0;
  }

  /**
   * 获取分享配置
   */
  getShareConfig(type) {
    var config = {
      title: this.defaultShareConfig.title,
      query: this.defaultShareConfig.query,
      imageUrl: this.defaultShareConfig.imageUrl,
    };

    // 根据分享类型调整配置
    if (type === 'shareTimeline') {
      config.title = this.defaultShareConfig.title + ' - 快来一起挑战吧！';
      config.query = 'from=timeline';
    }

    console.log('[WechatShare] 准备分享 (' + type + '):', config.title);

    return {
      title: config.title,
      imageUrl: config.imageUrl,
      query: config.query,
    };
  }

  /**
   * 更新默认分享配置
   */
  setDefaultConfig(config) {
    if (config.title !== undefined) {
      this.defaultShareConfig.title = config.title;
    }
    if (config.query !== undefined) {
      this.defaultShareConfig.query = config.query;
    }
    if (config.imageUrl !== undefined) {
      this.defaultShareConfig.imageUrl = config.imageUrl;
    }
    console.log('[WechatShare] 分享配置已更新:', this.defaultShareConfig);
  }

  /**
   * 主动分享（调用分享面板）
   * @param {Object} config - 自定义分享配置
   * @param {string} config.title - 分享标题
   * @param {string} [config.query] - 分享查询参数
   * @param {string} [config.imageUrl] - 分享图片路径
   */
  share(config) {
    if (typeof wx === 'undefined' || !wx.shareAppMessage) {
      console.warn('[WechatShare] 当前环境不支持主动分享');
      return;
    }

    var shareConfig = {
      title: config && config.title ? config.title : this.defaultShareConfig.title,
      imageUrl: config && config.imageUrl ? config.imageUrl : this.defaultShareConfig.imageUrl,
      query: config && config.query ? config.query : this.defaultShareConfig.query,
    };

    wx.shareAppMessage({
      title: shareConfig.title,
      imageUrl: shareConfig.imageUrl,
      query: shareConfig.query,
    });
  }
  
  /**
   * 带回调的分享（通过 onShow/onHide 检测分享行为）
   * 由于微信 shareAppMessage 不再提供 success/fail 回调，
   * 通过监听前后台切换来判断用户是否完成了分享操作
   * 
   * @param {Object} options - 分享选项
   * @param {string} options.title - 分享标题
   * @param {string} [options.query] - 分享查询参数
   * @param {string} [options.imageUrl] - 分享图片路径
   * @param {Function} [options.onSuccess] - 分享成功回调（从后台切回前台时触发）
   * @param {Function} [options.onCancel] - 分享取消/超时回调
   * @param {number} [options.timeout=500] - 超时时间（毫秒），用于判断是否真的进行了分享
   */
  shareWithCallback(options) {
    if (typeof wx === 'undefined' || !wx.shareAppMessage) {
      console.warn('[WechatShare] 当前环境不支持主动分享');
      // 非微信环境，直接触发成功回调（用于测试）
      if (options.onSuccess) {
        options.onSuccess();
      }
      return;
    }
    
    // 设置待处理的回调
    this.pendingShareCallback = options.onSuccess || null;
    this.pendingShareCancelCallback = options.onCancel || null;
    this.shareTimeout = options.timeout || 500;
    this.shareStartTime = 0; // 重置，等待 onHide 时设置
    
    console.log('[WechatShare] 发起带回调的分享:', options.title);
    
    // 发起分享
    wx.shareAppMessage({
      title: options.title,
      imageUrl: options.imageUrl,
      query: options.query,
    });
  }
}

// 导出单例
export var wechatShare = new WechatShare();
