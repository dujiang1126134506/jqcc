// H5 构建脚本
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

process.env.NODE_ENV = 'production';

const projectRoot = path.resolve(__dirname, '..');
const taroBin = path.join(projectRoot, 'node_modules', '.bin', 'taro');

// 检查 taro 是否可用，不可用则安装依赖
if (!fs.existsSync(taroBin)) {
  console.log('[build] taro not found, installing dependencies...');
  try {
    execSync('pnpm install --no-frozen-lockfile', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
  } catch (e) {
    console.error('[build] pnpm install failed, trying npm install...');
    try {
      execSync('npm install --no-audit --no-fund', {
        cwd: projectRoot,
        stdio: 'inherit',
      });
    } catch (e2) {
      console.error('[build] npm install also failed');
      process.exit(1);
    }
  }
}

// 再次检查
if (!fs.existsSync(taroBin)) {
  console.error('[build] taro still not found after install');
  console.error('[build] node_modules/.bin contents:');
  try {
    const bins = fs.readdirSync(path.join(projectRoot, 'node_modules', '.bin'));
    console.error(bins.join(', '));
  } catch (e) {
    console.error('node_modules/.bin does not exist');
  }
  process.exit(1);
}

console.log(`[build] using taro at: ${taroBin}`);
console.log('[build] running: taro build --type h5');

const result = spawnSync(taroBin, ['build', '--type', 'h5'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
});

process.exit(result.status || 0);
