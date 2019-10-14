# 微信小程序超仿抖音小视频

超仿抖音小视频示例源码，欢迎扫描以下小程序码体验。

> 提示：请使用微信开发者工具或微信客户端 6.7.2 及以上版本运行。

![](https://media.soso88.org/assets/demo/ss.png)


## 使用

使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开该示例代码。

主要的视频上下左右滑动切换视频的代码位置在：

    /miniprogram/page/lenglish/pages/index/index.js
    /miniprogram/page/lenglish/pages/viewvideo/viewvideo.js

## 实现原理

1.通过视频的poster图片动画切换，来完成视频切换的动画过程。

2.切换动画后使用CSS的层级关系属性z-index，将视频显示出来，启动播放。这样实现主要防止通过hideen方式或者wx:if方式导致的视频播放黑频闪帧的情况。

dist目录内容使用组件：https://github.com/wux-weapp/wux-weapp

## 贡献

如果你有 bug 反馈或其他任何建议，欢迎提 issue 给我们。

