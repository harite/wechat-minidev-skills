import PixiScene from './PixiScene';
import MenuScene from './MenuScene';

/**
 * 加载场景示例
 */
class LoadingScene extends PixiScene {
  onEnter(params) {
    super.onEnter(params);
    
    const systemInfo = wx.getSystemInfoSync();
    
    // 游戏标题
    const title = this.createText('核心框架示例', {
      fontSize: 48,
      fill: 0xffffff
    });
    title.anchor.set(0.5);
    title.x = systemInfo.screenWidth / 2;
    title.y = systemInfo.screenHeight / 2 - 100;
    this.stage.addChild(title);
    
    // 加载提示
    const loading = this.createText('加载中...', {
      fontSize: 24,
      fill: 0x999999
    });
    loading.anchor.set(0.5);
    loading.x = systemInfo.screenWidth / 2;
    loading.y = systemInfo.screenHeight / 2;
    this.stage.addChild(loading);
    
    // 健康游戏忠告
    const notice = this.createText(
      '抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\n' +
      '适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。',
      {
        fontSize: 14,
        fill: 0x666666,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: systemInfo.screenWidth - 40
      }
    );
    notice.anchor.set(0.5);
    notice.x = systemInfo.screenWidth / 2;
    notice.y = systemInfo.screenHeight - 80;
    this.stage.addChild(notice);
    
    // 模拟加载，2 秒后切换到主菜单
    setTimeout(() => {
      this.switchTo(MenuScene, { loadTime: 2000 });
    }, 2000);
  }
}

export default LoadingScene;
