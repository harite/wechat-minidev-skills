# 存档与排行榜

## 存档分类

### 核心存档（需云同步）
- **数据类型**：关卡进度、最高分、成就数量等单值数据
- **特征**：需跨设备同步、需防作弊、需排行榜展示
- **方案**：微信托管排行榜（`wx.getRankManager`）

### 非核心存档（仅本地）
- **数据类型**：音效开关、画质设置、临时状态
- **特征**：无需同步、用户偏好、临时数据
- **方案**：`localStorage`

## 核心存档实现（wx.getRankManager）

### 初始化
```javascript
const rankManager = wx.getRankManager()
```

### 写入存档（更新分数）
```javascript
// 更新关卡进度（如第 10 关），注意这里时覆盖写，需要本地提前做好冲突解决
rankManager.update({
  scoreKey: 'level', // 可以在 MP后台-运营功能管理-基础配置-游戏玩法ID 中配置
  score: 10, // 第10关，只支持number类型
})
```

### 读取存档
```javascript
rankManager.getScore({ // 注意该API不支持Promise
  scoreKeys: ['level'],
  periodType: 4, // 查询的周期：1: 自然日；2: 自然周；3: 自然月；4: 永久；5: 最新值
  success: (res) => {
    console.log('分数信息', res.scores)
    // res.scores 格式: { 'level': { score: 10, timestamp: 1234567890 } }
  },
  fail: () => {
    // 服务器失败，使用本地存档
    const localLevel = wx.getStorageSync('level') || 0
    // 标记需要下次同步
    wx.setStorageSync('needSync', true)
  }
})
```

## 冲突解决策略

### 自动合并规则
根据排行榜排序规则决定：
- **升序排行（越小越好）**：取最小值，如通关时间、步数
- **降序排行（越大越好）**：取最大值，如最高分、关卡进度、成就数量
- **以最后为准**：取时间戳最新的值，如最后通关关卡、最新配置

### 同步时机
1. **进入游戏时**：读取云端数据，与本地对比合并
2. **退出游戏时**：上传本地数据到云端
3. **关键节点**：通关、刷新最高分时立即上传
4. **重试机制**：失败标记 `needSync`，下次启动重试

## 非核心存档实现（localStorage）

```javascript
// 写入
wx.setStorageSync('settings', {
  soundEnabled: true,
  quality: 'high'
})

// 读取
const settings = wx.getStorageSync('settings')
```

## 排行榜集成（开放域）

### 核心流程
1. **主域** - 通过 `postMessage` 发送消息到开放域
2. **开放域** - 接收消息，调用 `wx.getFriendCloudStorage` 获取好友数据，渲染排行榜

### 提醒用户完成配置（功能实现后）

**用户隐私保护设置**（必须）
→ 参考 [`privacy-config.md`](./privacy-config.md)

需添加数据类型：**微信朋友关系**（搜索 `getFriendCloudStorage`）


### 参考示例
→ `examples/minigame-demo/miniprogram/js/api/abilityOpen/openDataContext`

### 注意事项
- **延迟调用**：游戏启动时不要立即调用开放域接口（`getFriendCloudStorage` 等），否则会触发隐私授权弹窗
- **触发时机**：
  - 玩家第一次产生成绩时再上报
  - 用户主动点击查看排行榜时再调用
- **技术要点**：
  - 主域与开放域隔离，只能通过 `postMessage` 通信
  - 开放域可访问好友数据（`wx.getFriendCloudStorage`）
  - 排行榜数据自动从 `wx.getRankManager` 同步 

## 最佳实践

### 核心存档
- ✅ 使用 `wx.getRankManager`（微信托管，无需服务器）
- ✅ 本地 + 云端双写（容错）
- ✅ 自动冲突解决（根据排序规则）
- ✅ 失败重试机制（每次进入游戏尝试与云端存档进行同步）
- ❌ 直接使用云开发（需自建服务器）

### 非核心存档
- ✅ 使用 `localStorage`（简单高效）
- ✅ 限制单个 key ≤ 1MB
- ❌ 存储敏感数据（明文存储）

### 排行榜
- ✅ 核心数据同步到开放域（好友排行）
- ✅ 定期更新排行榜（避免频繁刷新）
- ❌ 在主域操作开放域 DOM（隔离限制）
