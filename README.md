# webrtc 与 andorid 交互测试

可使用 browser-sync start --https --server --files "./*" 
开启 https 服务器  
web 与 手机需要访问同一IP，pc上不能使用 localhost，否则找不到相同房间  
原生 chrome 浏览器中使用必须在PC上有摄像头与话筒(笔记本)， 台式机没有话筒会直接报错
在QQ浏览器或360里使用极速模式没有话筒也可以

android 手机webview要关闭ssl证书错误的验证才能本地开发