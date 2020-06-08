const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const { connectionStr } = require('./config')
const App = new Koa();
const routering = require('./routes');

const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.connect(connectionStr, { useNewUrlParser: true },
  () => {
    console.log('mongodb 连接成功')
  }
)
mongoose.connection.on('error', console.error)

// 生产环境错误stack信息隐藏
App.use(error({
  // 格式化错误信息
  postFormat: (e, { stack, ...rest }) => {
    return process.env.NODE_ENV === 'production'
      ? rest
      : { stack, ...rest }
  }
}))

App.use(bodyParser());

// 参数校验中间件
App.use(parameter(App))

// 注册路由
routering(App);

App.listen(8888, () => {
  console.log('服务启动在8888端口')
})
