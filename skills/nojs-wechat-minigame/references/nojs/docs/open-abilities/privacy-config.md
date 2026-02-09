# 用户隐私保护配置

## 配置时机

**在涉及用户隐私的功能实现后，必须提醒用户完成配置**

## 配置步骤

### 1. 登录微信公众平台
访问 [微信公众平台](https://mp.weixin.qq.com) → 设置 → 基本设置

### 2. 添加隐私保护指引
- 进入"用户隐私保护指引"
- 点击"添加信息类型"
- 根据功能选择对应的数据类型（见下表）
- 填写收集场景说明

### 3. 开启隐私授权弹窗组件（强烈推荐）
- 在同一页面开启"隐私授权弹窗"官方组件
- 用户首次使用相关功能时会自动弹出授权请求

## 常见数据类型

| 用户信息类型 | 接口或组件（搜索关键词） |
|------------|----------------------|
| 昵称、头像 | `wx.getUserInfo`、`wx.getUserProfile`、`wx.createUserInfoButton` |
| 位置信息 | `wx.authorize({scope:'scope.userLocation'})`、`wx.getLocation`、`wx.getFuzzyLocation` |
| 微信运动步数 | `wx.authorize({scope:'scope.werun'})`、`wx.getWeRunData` |
| 选中的照片或视频信息 | `wx.chooseImage`、`wx.chooseMedia` |
| 选中的文件 | `wx.chooseMessageFile` |
| 麦克风(实时语音) | `wx.authorize({scope:'scope.record'})`、`wx.startRecord`、`RecorderManager.start`、`wx.joinVoIPChat` |
| 摄像头 | `wx.authorize({scope:'scope.camera'})`、`wx.createVKSession`、`wx.createCamera` |
| 蓝牙 | `wx.openBluetoothAdapter`、`wx.createBLEPeripheralServer` |
| 相册（仅写入）权限 | `wx.authorize({scope:'scope.writePhotosAlbum'})`、`wx.saveImageToPhotosAlbum` |
| 微信朋友关系 | `wx.getFriendCloudStorage`、`wx.getGroupCloudStorage`、`wx.getGroupInfo`、`wx.getPotentialFriendList`、`wx.getUserCloudStorageKeys`、`GameServerManager.getFriendsStateData`、`wx.getUserInteractiveStorage` |
| 游戏社区数据 | `wx.getGameClubData` |
| 直播数据 | `wx.getChannelsLiveInfo` |
| 加速传感器 | `wx.stopAccelerometer`、`wx.startAccelerometer`、`wx.onAccelerometerChange`、`wx.offAccelerometerChange` |
| 磁场传感器 | `wx.stopCompass`、`wx.startCompass`、`wx.onCompassChange`、`wx.offCompassChange` |
| 方向传感器 | `wx.stopDeviceMotionListening`、`wx.startDeviceMotionListening`、`wx.onDeviceMotionChange`、`wx.offDeviceMotionChange` |
| 陀螺仪传感器 | `wx.stopGyroscope`、`wx.startGyroscope`、`wx.onGyroscopeChange`、`wx.offGyroscopeChange` |
| 剪切板 | `wx.setClipboardData`、`wx.getClipboardData` |

## 注意事项

- ❌ **未设置隐私保护指引**：隐私相关 API 调用将失败
- ✅ **及时更新**：新增隐私功能后需同步更新隐私指引
- ✅ **启用弹窗组件**：提升用户体验，自动处理授权流程

## 参考文档

→ [小游戏隐私合规开发指南](https://developers.weixin.qq.com/community/minigame/doc/000aa25cf1c8a0e64310ac3ef66401)（微信官方）
