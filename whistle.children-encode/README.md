# whistle.children-encode

### 儿保解密请求插件

1. [安装 whistle](https://wproxy.org/whistle/install.html)
2. 安装插件：`npm install -g whistle.children-encode`
3. 打开 whistle，点击菜单栏的`Plugins`，搜索`children-encode`，勾选`children-encode`
4. 点击菜单栏的`Rules`，新建一个规则
   > 使用代理 eg: https://10.201.xx.yy proxy://username:password@proxy-host:proxy-port
   > <br/>使用插件 eg: https://10.201.xx.yy children-encode:// pipe://children-encode
5. 保存规则，刷新页面(页面需要使用 chrome 本地 overwrite 功能)
   ![本地覆盖](./readme/overwrite.png)
6. chrome 打开 Sources 面板，找到对应的资源文件，右键点击`Override content`，然后使用本项目 overwrite 文件夹下面对应文件覆盖即可
