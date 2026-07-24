# 积分查询小程序

基于 Taro 4 + React + TypeScript 的电竞赛事积分查询小程序，支持编译为微信小程序和 H5 双端。

## 技术栈

- **框架**: Taro 4.2.1 (React 18)
- **语言**: TypeScript
- **样式**: SCSS
- **状态管理**: Zustand
- **构建**: Webpack 5

## 目录结构

```
├── config/                 # Taro 配置
│   ├── index.js           # 基础配置
│   ├── dev.js             # 开发环境
│   └── prod.js            # 生产环境
├── src/
│   ├── components/        # 公共组件
│   │   ├── TabBar.tsx     # 底部导航栏
│   │   └── SeasonSelector.tsx  # 赛季选择器
│   ├── data/
│   │   └── mockData.ts    # Mock 数据（战队/选手/比赛）
│   ├── pages/             # 页面
│   │   ├── index/         # 首页（排行榜）
│   │   ├── schedule/      # 赛程页
│   │   ├── profile/       # 个人中心
│   │   └── login/         # 登录页
│   ├── store/
│   │   └── index.ts       # Zustand 全局状态
│   ├── types/
│   │   └── index.ts       # TypeScript 类型定义
│   ├── app.config.ts      # 小程序全局配置（页面路由、tabBar）
│   ├── app.scss           # 全局样式
│   ├── app.tsx            # 应用入口
│   ├── global.d.ts        # 全局类型声明
│   └── index.html         # H5 模板
├── project.config.json    # 微信小程序项目配置
├── babel.config.js        # Babel 配置
├── tsconfig.json          # TS 配置
└── package.json
```

## 数据模型

### 核心类型 (`src/types/index.ts`)
- `Team` - 战队（id/名称/logo/主题色/选手ID列表）
- `Player` - 选手（id/姓名/头像/战队ID/位置/身份）
- `PlayerScore` - 选手得分（阶段/轮次/日期/身份/版型/胜负分/投票分/技能分/违规分/额外分/MVP/SVP/背锅）
- `Match` - 比赛（id/赛季ID/阶段/轮次/日期/时间/战队/比分/BO数/状态）
- `Season` - 赛季（id/名称/开始时间/结束时间/状态）
- `UserInfo` - 用户信息（id/昵称/头像/openid）

### 得分计算公式
```
选手总分 = 胜负分 + 投票分 + 技能分 + 违规分 + 额外分
战队总分 = 战队下所有选手得分之和
战队均分 = 战队总分 ÷ 战队选手人数
```

## 页面说明

### 登录页 (`pages/login`)
- 微信授权一键登录
- 模拟获取微信昵称、头像
- 登录态存储在 localStorage + Zustand

### 首页 (`pages/index`)
- 顶部赛季切换下拉
- 赛季数据统计卡片
- 三类排行榜 Tab 切换：
  - 战队总分榜
  - 选手总分榜
  - 战队均分榜

### 赛程页 (`pages/schedule`)
- 赛季切换
- 比赛阶段筛选
- 按日期分组展示
- 比赛状态（未开始/进行中/已结束）

### 个人中心 (`pages/profile`)
- 用户信息展示
- 数据统计
- 功能菜单列表

## 构建命令

```bash
# 安装依赖
pnpm install

# 微信小程序
pnpm run build:weapp    # 构建
pnpm run dev:weapp      # 开发监听

# H5
pnpm run build:h5       # 构建
pnpm run dev:h5         # 开发监听
```

## 微信小程序发布

1. 执行 `pnpm run build:weapp`
2. 用微信开发者工具打开 `dist/` 目录
3. 填写 AppID（在 `project.config.json` 中修改）
4. 上传代码

## 开发规范

- 使用 Taro 内置组件（View, Text, Image 等），不使用原生 HTML 标签
- 样式使用 SCSS，按页面/组件拆分
- 状态管理使用 Zustand，跨页面共享数据
- 单位使用 rpx（750 设计稿）
