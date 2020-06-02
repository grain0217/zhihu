const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const { connectionStr } = require('./config')
// const KoaBody = require('koa-body')
const App = new Koa();
// const router = new Router();
const routering = require('./routes');

const mongoose = require('mongoose')

mongoose.connect(connectionStr, { useNewUrlParser: true },
  () => {
    console.log('mongodb 连接成功')
  }
)
mongoose.connection.on('error', console.error)

// 生产环境错误stack信息隐藏
App.use(error({
  postFormat: (e, { stack, ...rest }) => {
    return process.env.NODE_ENV === 'production'
      ? rest
      : { stack, ...rest }
  }
}))
// App.use(async (ctx, next) => {
//   try {
//     await next()
//   } catch (error) {
//     ctx.status = error.status || error.statusCode || 500
//     ctx.body = {
//       msg: error.message
//     }
//   }
// })

App.use(bodyParser());

App.use(parameter(App))

routering(App);

// App.use(userRouter.routes());
// App.use(router.routes());
// App.use(router.allowedMethods());
// App.use(KoaBody())

App.listen(8888, () => {
  console.log('服务启动在8888端口')
})
