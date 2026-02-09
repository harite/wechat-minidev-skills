# 微信小游戏开放能力接入指南

## 日志系统

→ 参考 [`open-abilities/logger.md`](./open-abilities/logger.md)

**核心方案**：Logger封装 `console` + `wx.getLogManager` + `wx.getGameLogManager`（新版实时日志），通过构建时代码转换实现零性能损耗

## 分享

→ 参考 [`open-abilities/share.md`](./open-abilities/share.md)

**核心方案**：通过 `wx.onHide`/`wx.onShow` 监听前后台切换，间接实现分享回调检测（微信已不再提供回调）

## 分数/存档/朋友排行榜

→ 参考 [`open-abilities/save-and-rank.md`](./open-abilities/save-and-rank.md)

**核心方案**：使用 `wx.getRankManager` 管理分数和存档（无需服务器），自动同步到开放域实现好友排行榜

## 实时语音

→ 参考 [`open-abilities/voip.md`](./open-abilities/voip.md)

**核心方案**：`wx.joinVoIPChat` 加入房间（签名通过云函数获取），需配置隐私保护指引

## 实时对战

→ 参考 [`open-abilities/realtime-battle.md`](./open-abilities/realtime-battle.md)

**核心方案**：微信官方帧同步服务（`GameServerManager`），无需自建服务器，确保确定性可重放

## 游戏圈

→ 参考 [`open-abilities/game-club.md`](./open-abilities/game-club.md)

**核心方案**：`wx.createGameClubButton` 创建入口，建议使用透明按钮 + 游戏自绘样式

## 投诉反馈

→ 参考 [`open-abilities/feedback.md`](./open-abilities/feedback.md)

**核心方案**：`wx.createFeedbackButton` 创建反馈按钮，建议在设置/关于页面接入

## 示例项目

→ `examples/minigame-demo`（官方示例）
→ `examples/minigame-lockstep-demo`（帧同步示例）

**关键示例**：
- 实时语音：`minigame-demo/miniprogram/js/api/abilityOpen/VoIPChat`
- 云函数签名：`minigame-demo/cloudfunctions/getSignature`
- 开放域排行榜：`minigame-demo/miniprogram/open-data`
- 帧同步对战：`minigame-lockstep-demo`（房间管理、确定性实现）
- 游戏圈按钮：`minigame-demo/miniprogram/js/api/abilityOpen/createGameClubButton`