// 生产环境静态文件服务器
// 部署系统会以 Node.js 服务方式启动
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.DEPLOY_RUN_PORT || process.env.PORT || 5000;

// 托管 Taro H5 构建产物
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA 路由回退（支持所有路径）
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`[server] 积分查询小程序 H5 版已启动: http://localhost:${port}`);
});
