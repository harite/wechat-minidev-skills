# 微信小游戏分享功能

## 核心问题

微信小游戏的 `wx.shareAppMessage` **不再提供回调**（success/fail），导致无法直接判断用户是否完成分享。

## 解决方案

通过监听 `wx.onHide`（切到后台）和 `wx.onShow`（切回前台）来**间接检测**分享行为：

1. 调用 `wx.shareAppMessage` 后，用户点击好友会切到后台（触发 `onHide`）
2. 用户完成分享或取消后，会切回前台（触发 `onShow`）
3. 根据**后台停留时间**判断：
   - `>= 500ms` → 认为完成了分享（触发成功回调）
   - `< 500ms` → 认为取消了分享（触发取消回调）

## 使用方法

### 1. 初始化

在游戏启动时调用一次：

```javascript
import { wechatShare } from '@/utils/WechatShare';

// 初始化分享功能
wechatShare.initialize();

// 设置默认分享配置
wechatShare.setDefaultConfig({
  title: '我的游戏',
  query: 'from=share',
  // imageUrl: 'share.png' // 可选，不设置则默认截取当前屏幕内容
});
```

### 2. 带回调的分享

适用于需要在分享后发放奖励等场景：

```javascript
wechatShare.shareWithCallback({
  title: '快来一起玩这个游戏！',
  query: 'from=invite&level=1',
  // imageUrl: 'share.png', // 可选，不设置则默认截取当前屏幕内容
  onSuccess: function() {
    console.log('分享成功，发放奖励');
    // 给玩家奖励
  },
  onCancel: function() {
    console.log('分享取消');
  },
  timeout: 500 // 可选，默认 500ms
});
```

### 3. 普通分享

不需要回调的场景：

```javascript
wechatShare.share({
  title: '我的游戏分数：99999',
  query: 'from=score',
});
```

## 工具类位置

`templates/project/src/utils/WechatShare.js` - 已包含在项目模板中，可直接使用。

## 注意事项

- **分享图片**：`imageUrl` 不设置时，微信会自动截取当前屏幕内容作为分享图
- **超时时间**：默认 500ms，可根据实际情况调整（过短可能误判）
- **准确性**：无法 100% 确定用户是否真的发送了分享，只能通过时间阈值推测
- **一次一个**：同一时间只能有一个待处理的分享回调（新分享会覆盖旧的）
- **测试环境**：非微信环境会直接触发成功回调，便于测试
- **withShareTicket 参数**：
  - ❌ **普通分享不要设置**：设置后分享卡片无法长按转发，影响传播
  - ✅ **仅群排行使用**：只有查看群排行榜的分享才需要设置 `withShareTicket: true`
  - 用途：获取 shareTicket 用于查询群同玩成员的游戏数据

## 实现原理

```
用户点击分享 → 切到后台(onHide) → 记录时间
              ↓
    用户选择好友发送 / 取消
              ↓
    切回前台(onShow) → 判断后台停留时间
              ↓
    >= 500ms → 触发成功回调
    < 500ms  → 触发取消回调
```
