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

// 使用koa-jwt做用户认证，需要登录
const auth = jwt({ secret: privateKey })

router.get('/', userController.list)

// 查
router.get('/:id', userController.checkUserExist, userController.queryById)
// 增
router.post('/', userController.create);
// 改
// put => 全部替换； patch => 部分替换
router.patch('/:id', auth, userController.checkUserExist, userController.update)
// 删
router.delete('/:id', auth, userController.delete)

// 登录
router.post('/login', userController.login)

// 具体用户的关注列表
router.get('/:id/following', userController.checkUserExist, userController.followingList)
// 具体用户的粉丝列表
router.get('/:id/follower', userController.checkUserExist, userController.followerList)

// 关注知乎er
router.put('/follow/:id', auth, userController.checkUserExist, userController.follow)
// 取关知乎er
router.put('/unfollow/:id', auth, userController.checkUserExist, userController.unfollow)

// 具体用户的关注话题列表
router.get('/:id/topics', userController.checkUserExist, userController.followingTopicList)

// 具体用户的提问
router.get('/:id/questions', userController.checkUserExist, userController.listQuestion)

module.exports = router
