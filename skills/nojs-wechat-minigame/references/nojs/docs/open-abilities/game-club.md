# 游戏圈

## 核心方案

使用 `wx.createGameClubButton` 创建游戏圈入口按钮

## 关键点

- **不设置 icon**：建议不使用系统默认图标，改用自定义按钮和文案
- **纯文字展示**：使用游戏自己的 UI 风格，提升一致性
- **透明覆盖**：微信按钮设置为透明，覆盖在游戏自绘按钮上

## 实现方式

### 1. 游戏自绘按钮（推荐）

```javascript
// 创建透明的微信游戏圈按钮
const gameClubButton = wx.createGameClubButton({
  icon: '',  // 不设置 icon，使用透明按钮
  style: {
    left: 10,
    top: 10,
    width: 100,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0)',  // 透明背景
    borderWidth: 0
  }
});

// 游戏内自己绘制按钮（Pixi.js 示例）
const customButton = new PIXI.Text('游戏圈', {
  fontSize: 24,
  fill: 0xFFFFFF
});
customButton.position.set(10, 10);
// 确保自绘按钮和微信按钮位置完全重合
```

### 2. 销毁按钮

```javascript
// 场景切换时记得销毁
gameClubButton.destroy();
```

## 注意事项

- ✅ **自定义样式**：使用透明按钮 + 游戏自绘，保持 UI 一致性
- ✅ **位置对齐**：确保微信按钮和自绘按钮完全重合
- ✅ **及时销毁**：场景切换时销毁按钮，避免内存泄漏
- ❌ **不推荐使用系统图标**：`icon: 'green'` 等系统样式与游戏风格不统一

## 参考示例

→ `examples/minigame-demo/miniprogram/js/api/abilityOpen/createGameClubButton`
