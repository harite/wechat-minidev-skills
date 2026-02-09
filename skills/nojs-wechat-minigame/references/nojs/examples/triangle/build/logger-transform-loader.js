/**
 * Logger日志转换Loader
 * 
 * 功能:
 * 1. 将 Logger.xxx(args) 转换为带文件名、行号、函数名的调用
 * 2. 对于低于当前日志级别的调用,添加needLog判断以避免参数计算
 * 
 * 转换示例:
 * 原始: Logger.debug(expensiveOperation())
 * 转换后: Logger.needLog('debug') && Logger.debug('Game.js', 10, 'update', expensiveOperation())
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const path = require('path');

const LOG_METHODS = ['debug', 'log', 'info', 'impt', 'warn', 'error'];

module.exports = function(source) {
  // 获取loader选项
  const options = this.getOptions() || {};
  const enableNeedLogCheck = options.enableNeedLogCheck !== false;

  // 跳过Logger.js自身和node_modules
  if (this.resourcePath.includes('Logger.js') || 
      this.resourcePath.includes('node_modules')) {
    return source;
  }

  // 计算相对文件路径
  const relativePath = path.relative(this.rootContext, this.resourcePath);
  const fileName = path.basename(this.resourcePath);

  try {
    // 解析AST
    const ast = parser.parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties', 'objectRestSpread']
    });

    let transformed = false;

    // 遍历AST并转换Logger调用
    traverse(ast, {
      CallExpression: (path) => {
        const { node } = path;
        
        // 检查是否是 Logger.xxx() 形式的调用
        if (!t.isMemberExpression(node.callee)) return;
        if (!t.isIdentifier(node.callee.object, { name: 'Logger' })) return;
        if (!t.isIdentifier(node.callee.property)) return;
        
        const methodName = node.callee.property.name;
        if (!LOG_METHODS.includes(methodName)) return;
        
        // 跳过needLog调用,避免无限递归
        if (methodName === 'needLog') return;
        
        // 如果第一个参数已经是字符串字面量且第二个是数字(已转换过),跳过
        if (node.arguments.length >= 3 &&
            t.isStringLiteral(node.arguments[0]) &&
            t.isNumericLiteral(node.arguments[1])) {
          return;
        }

        // 获取调用位置信息
        const line = node.loc ? node.loc.start.line : 0;
        
        // 尝试获取所在函数名
        let funcName = '';
        let parentPath = path.parentPath;
        while (parentPath) {
          if (t.isFunctionDeclaration(parentPath.node) && parentPath.node.id) {
            funcName = parentPath.node.id.name;
            break;
          } else if (t.isClassMethod(parentPath.node) && t.isIdentifier(parentPath.node.key)) {
            funcName = parentPath.node.key.name;
            break;
          } else if (t.isObjectMethod(parentPath.node) && t.isIdentifier(parentPath.node.key)) {
            funcName = parentPath.node.key.name;
            break;
          } else if (t.isVariableDeclarator(parentPath.node) && 
                     t.isIdentifier(parentPath.node.id) &&
                     (t.isFunctionExpression(parentPath.node.init) || 
                      t.isArrowFunctionExpression(parentPath.node.init))) {
            funcName = parentPath.node.id.name;
            break;
          } else if (t.isAssignmentExpression(parentPath.node) &&
                     t.isMemberExpression(parentPath.node.left) &&
                     t.isIdentifier(parentPath.node.left.property)) {
            funcName = parentPath.node.left.property.name;
            break;
          }
          parentPath = parentPath.parentPath;
        }

        // 构造新的参数列表: file, line, func, ...originalArgs
        const newArgs = [
          t.stringLiteral(fileName),  // 使用文件名而不是完整路径,更简洁
          t.numericLiteral(line),
          t.stringLiteral(funcName),
          ...node.arguments
        ];

        // 创建新的Logger调用
        const newLoggerCall = t.callExpression(node.callee, newArgs);

        // 如果启用needLog检查,添加条件判断
        if (enableNeedLogCheck) {
          // 创建 Logger.needLog('level') 调用
          const needLogCall = t.callExpression(
            t.memberExpression(
              t.identifier('Logger'),
              t.identifier('needLog')
            ),
            [t.stringLiteral(methodName)]
          );

          // 创建 Logger.needLog('level') && Logger.xxx(...)
          const logicalExpression = t.logicalExpression(
            '&&',
            needLogCall,
            newLoggerCall
          );

          path.replaceWith(logicalExpression);
        } else {
          // 直接替换为新的调用
          path.replaceWith(newLoggerCall);
        }

        transformed = true;
      }
    });

    // 如果有转换,重新生成代码
    if (transformed) {
      const output = generate(ast, {
        retainLines: true,
        compact: false,
        comments: true
      });

      return output.code;
    }

    return source;
  } catch (e) {
    // 解析失败,返回原始代码
    console.error(`Logger转换失败 [${this.resourcePath}]:`, e.message);
    return source;
  }
};
