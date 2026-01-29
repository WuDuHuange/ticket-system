1.访问 https://console.cloud.google.com/apis/credentials 这个页面。点击“+创建凭证”按钮，选择OAuth客户端ID。
2.应用类型选择Web应用。已获授权的 JavaScript 来源和已获授权的重定向 URI均填写：http://localhost:3000 （此处根据前端调试接口的实际情况修改） ， http://localhost:8000 ， http://localhost:63343 。点击保存。
3.启动后端时，需配置GOOGLE_OAUTH_CLIENT_ID环境变量，值为刚刚的配置的客户端id。
4.后端接口调用测试时可使用测试用html文件获取ssoToken后进行调用。在使用之前，需要将html文件第168行的'YOUR_GOOGLE_CLIENT_ID'替换成第2步获取的客户端id。