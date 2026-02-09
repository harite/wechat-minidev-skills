# 实时语音（VoIP）

## 核心流程
1. **加入房间** - `wx.joinVoIPChat`（签名通过云函数获取）
2. **离开房间** - `wx.exitVoIPChat`

## 关键点
- **签名必须通过云函数获取**（客户端不可直接生成，防伪造）
- **房间名唯一** - 相同房间名进入同一语音房
- **权限授权** - 隐私声明设置后平台自动处理

## 提醒用户完成配置（功能实现后）

**1. 开通云开发**
- 微信开发者工具 → 云开发 → 开通并创建环境

**2. 部署云函数**
- 右键 `cloudfunctions/getSignature` → 上传并部署

**3. 用户隐私保护设置**（必须）
→ 参考 [`privacy-config.md`](./privacy-config.md)

需添加数据类型：**麦克风**（搜索 `joinVoIPChat`）


## 参考示例
- 主域代码：`examples/minigame-demo/miniprogram/js/api/abilityOpen/VoIPChat`
- 云函数：`examples/minigame-demo/cloudfunctions/getSignature`
