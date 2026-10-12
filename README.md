# 架势之刃 · 灰庭试炼

Godot 4.3 2.5D 横版动作试玩，使用 WebAssembly 与 WebGL 2。

主角：狼。BOSS：尾名荣一郎。

## 游玩

电脑浏览器打开 GitHub Pages 地址，点击“进入灰庭”。
A / D 移动、Space 跳跃、J 攻击、K 防御 / 弹反、E 忍杀、R 重来、P 暂停。

## 发布设置

将此目录中的文件放入一个新公开仓库的 main 分支根目录，包括 .nojekyll。
在 Settings → Pages 中选择 Deploy from a branch，分支 main，目录 /(root)，保存。
以 GitHub 显示的已发布地址为准；文件夹上传不能替代解压后的文件上传。

引擎为单线程，不需要特殊跨域隔离头。所有资源链接使用相对路径，支持项目仓库路径。
许可见 GODOT_NOTICES.txt、FONT_OFL.txt 与 licenses.html。
