import ThreeScene from './ThreeScene';
import MenuScene from './MenuScene';

/**
 * 加载场景示例 (3D)
 */
class LoadingScene extends ThreeScene {
  onEnter(params) {
    super.onEnter(params);
    
    // 添加 HUD 标题
    const title = this.createHUDText('核心框架示例 (3D)', {
      fontSize: 48,
      color: '#ffffff',
      x: 0,
      y: 200
    });
    this.addToHUD(title);
    
    // 游戏忠告
    const notice = this.createHUDText(
      '抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。',
      {
        fontSize: 16,
        color: '#999999',
        x: 0,
        y: -200
      }
    );
    this.addToHUD(notice);
    
    // 2 秒后切换到菜单场景
    setTimeout(() => {
      this.switchTo(MenuScene);
    }, 2000);
  }
}

export default LoadingScene;
