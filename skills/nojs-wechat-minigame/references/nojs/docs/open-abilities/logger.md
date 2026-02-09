# 小游戏日志系统

## 核心方案

统一使用 **Logger** 记录日志，底层封装了：
- `console.log` - 开发者工具直接可见
- `wx.getLogManager` - 离线日志（最多5MB，用户反馈时上传）
- `wx.getGameLogManager` - 实时日志（新版，支持commonInfo，实时上报+后台检索）

## Logger使用

### 基本调用

```javascript
Logger.debug('调试信息', data);
Logger.log('普通日志', data);
Logger.info('提示信息', data);
Logger.impt('关键业务节点', data);
Logger.warn('警告', data);
Logger.error('错误', error);
```

**文件名、行号、函数名自动注入**（webpack构建时）

### 日志级别

| 级别 | console | getLogManager | getGameLogManager |
|------|---------|---------------|-------------------|
| debug/log/info/warn | ✅ | ✅ | ❌ |
| impt | ✅ | ✅ | ✅ (实时) |
| error | ✅ | ✅ | ✅ (实时) |

### 级别控制

```javascript
Logger.setLevel('debug');  // 开发：所有日志
Logger.setLevel('warn');   // 生产：仅警告和错误
```

## 性能优化

### 惰性求值

```javascript
// 原始代码
Logger.debug('数据', expensiveOperation());

// 构建后
Logger.needLog('debug') && Logger.debug('file.js', 10, 'func', expensiveOperation());
```

**关键**：`setLevel('warn')` 时，`needLog('debug')` 返回false，短路求值使 `expensiveOperation()` 不执行

### 高频调用场景

```javascript
class Game {
  update() {  // 60fps
    Logger.debug('帧更新', this.getDebugInfo());
  }
}
// 生产环境setLevel('warn')后，零性能损耗
```

## 最佳实践

### 环境配置
```javascript
const isProd = process.env.NODE_ENV === 'production';
Logger.setLevel(isProd ? 'warn' : 'debug');
```

### 关键节点
```javascript
Logger.impt('游戏启动', { version, platform });
Logger.impt('关卡完成', { level, score });
Logger.impt('支付成功', { orderId, amount });
```

### 错误捕获
```javascript
wx.onError((error) => Logger.error('运行时错误', error));
wx.onUnhandledRejection((res) => Logger.error('Promise错误', res.reason));
```

## 日志查看

- 开发：微信开发者工具控制台
- mp.weixin.qq.com-用户反馈 ：用户反馈系统会自动带上相关log
- mp.weixin.qq.com-游戏日志分析：基础数据 -> 游戏日志分析
