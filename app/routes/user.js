// const jwt = require('jsonwebtoken')
const jwt = require('koa-jwt')
const { privateKey } = require('../config')
const Router = require('koa-router');

const router = new Router({
  prefix: '/users'
});

const userController = require('../controllers/user')

// 用户认证
// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jwt.verify(token, privateKey)
//     ctx.state.user = user
//   } catch (err) {
//     ctx.throw(401, err.message)
//   }
//   await next()
// }

// 使用koa-jwt做用户认证
const auth = jwt({ secret: privateKey })

router.get('/', userController.list)

// 查
router.get('/:id', userController.query)

// 增
router.post('/', userController.create);

// 改
// put => 全部替换； patch => 部分替换
router.patch('/:id', auth, userController.update)

// 删
router.delete('/:id', auth, userController.delete)

// 登录
router.post('/login', userController.login)

module.exports = router
