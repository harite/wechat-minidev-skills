# 实时对战指南

## 核心方案

**优先使用微信官方帧同步服务**：`GameServerManager`（无需自建服务器）

## 核心流程

### 1. 初始化与登录
```javascript
const gameServerManager = wx.getGameServerManager()

// 登录（必须先执行）
gameServerManager.login()
```

### 2. 创建/加入房间
```javascript
// 房主创建房间
gameServerManager.createRoom({
  maxMemberNum: 2,
  success: (res) => {
    const accessInfo = res.accessInfo // 房间凭证，分享给其他玩家
  }
})

// 其他人加入房间（一般是通过分享房间到群聊，若未 login，需先补充 login）
gameServerManager.joinRoom({
  accessInfo: accessInfo
})
```

### 3. 开始游戏
```javascript
// join/create 成功后才能 startGame
gameServerManager.startGame()
```

### 4. 帧同步
```javascript
// 监听帧同步事件（必须收到首帧后才能上传命令）
gameServerManager.onSyncFrame((frame) => {
  // 执行所有玩家的帧命令
  frame.actionList.forEach(action => {
    executeAction(action)
  })
})

// 上传帧命令
gameServerManager.uploadFrame({
  frameData: { type: 'move', x: 10, y: 20 }
})
```

## 关键原则

### 游戏配置要求
**帧同步不支持高性能模式**：
- ❌ 禁用：`iOSHighPerformance`、`iOSHighPerformance+` 模式
- ✅ 配置：在 `game.json` 中删除这两个选项
- 原因：高性能模式与帧同步服务暂不兼容

**game.json 示例**：
```json
{
  "deviceOrientation": "portrait"
  // 注意：不要添加 iOSHighPerformance 或 iOSHighPerformance+ 配置
}
```

### 确定性（可重放）
**所有帧命令依赖的上下文和执行机制必须是确定的、可复现的**

- ❌ 禁用：`Math.random()`、`Date.now()`、`setTimeout`
- ✅ 使用：种子随机数（随机种子在命令上下文中传递）
- ✅ 使用：固定时间步长（帧号作为时间基准）

**示例**：
```javascript
// ❌ 错误：不确定的随机
const damage = Math.random() * 100

// ✅ 正确：确定性随机（种子在命令中）
function seededRandom(seed) {
  // 确定性随机算法
}
const damage = seededRandom(frameData.seed) * 100
```

### 时序要求
1. **login** → 必须先登录
2. **createRoom/joinRoom** → 若未 login，需先补充
3. **startGame** → join/create 成功后才能调用
4. **uploadFrame** → 收到首帧（onSyncFrame）后才能上传

## 最佳实践

### 命令设计
- **最小化数据**：仅传输输入指令（如方向、技能 ID），不传输状态
- **序列化**：使用简洁格式（如数组 `[type, x, y]` 而非对象）

### 容错处理
- **断线重连**：监听 `onRoomInfoChange`，处理玩家掉线
- **帧等待**：某玩家延迟时，等待其帧命令（避免不同步）

### 调试技巧
- **录像回放**：保存所有帧命令，可离线重放调试
- **确定性验证**：多次运行相同帧序列，结果应完全一致

## 参考示例

→ `examples/minigame-lockstep-demo`（官方帧同步示例）

**关键代码**：
- 房间管理：创建/加入/开始
- 帧同步：上传/接收/执行
- 确定性实现：种子随机数、固定时间步长
