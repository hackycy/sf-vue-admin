### sf-vue-admin

![](https://img.shields.io/github/commit-activity/m/hackycy/sf-vue-admin) ![](https://img.shields.io/github/license/hackycy/sf-vue-admin) ![](https://img.shields.io/github/repo-size/hackycy/sf-vue-admin) ![](https://img.shields.io/github/languages/top/hackycy/sf-vue-admin)

**基于EggJs + TypeScript + TypeORM + Redis + MySql + Vue + Element-UI编写的一款简单高效的前后端分离的权限管理系统。希望这个项目在全栈的路上能够帮助到你。**

后端项目地址：[传送门](https://github.com/hackycy/sf-egg-admin)

### 演示地址

[http://opensource.admin.si-yee.com](http://opensource.admin.si-yee.com/)

演示环境账号密码：

| 账号      | 密码   | 权限                     |
| --------- | ------ | ------------------------ |
| openadmin | 123456 | 仅只有各个功能的查询权限 |
| monitoradmin | 123456 |  系统监控页面及按钮权限  |

### 开发

```bash
# 克隆项目
git clone https://github.com/hackycy/sf-vue-admin

# 进入项目目录
cd sf-vue-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

### 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

### 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

### 欢迎Star && PR

如果项目有帮助到你可以点个Star支持下。有更好的实现欢迎PR。

### Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |
