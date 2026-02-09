# 投诉反馈

## 核心方案

使用 `wx.createFeedbackButton` 创建反馈按钮

## 使用场景

**建议在游戏的"关于"或"设置"页面接入投诉反馈功能**

## 实现方式

```javascript
// 创建反馈按钮（透明覆盖，配合游戏自绘）
const feedbackButton = wx.createFeedbackButton({
  type: 'text',
  text: '反馈建议',
  style: {
    left: 10,
    top: 10,
    width: 120,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 0
  }
});

// 销毁
feedbackButton.destroy();
```

## 注意事项

- ✅ **场景建议**：放在设置页、关于页等用户能轻易找到的位置
- ✅ **及时销毁**：场景切换时销毁按钮，避免内存泄漏
- ✅ **自定义样式**：使用透明按钮 + 游戏自绘，保持 UI 一致性
