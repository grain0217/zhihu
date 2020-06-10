const Koa = require('koa');
const koaBody = require('koa-body');
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const App = new Koa();
const path = require('path')
const routering = require('./routes');

require('./connect')
 
// 生产环境错误stack信息隐藏
App.use(error({
  // 格式化错误信息
  postFormat: (e, { stack, ...rest }) => {
    return process.env.NODE_ENV === 'production'
      ? rest
      : { stack, ...rest }
  }
}))

App.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true
  }
})); 

// 参数校验中间件
App.use(parameter(App))

// 注册路由
routering(App);

App.listen(8888, () => {
  console.log('服务启动在8888端口')
})
