// Taro H5 构建脚本
// 不依赖 cross-env，直接设置环境变量
process.env.NODE_ENV = 'production';

const { execSync } = require('child_process');
const path = require('path');

try {
  const args = process.argv.slice(2).join(' ');
  const cmd = `npx taro build --type h5 ${args}`.trim();
  console.log(`> ${cmd}`);
  execSync(cmd, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, NODE_ENV: 'production' }
  });
} catch (err) {
  process.exit(err.status || 1);
}
