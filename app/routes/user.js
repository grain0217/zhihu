const Router = require('koa-router');

const router = new Router({
  prefix: '/users'
});
const userController = require('../controllers/user')

// const auth = async (ctx, next) => {
//   // if (ctx.url !== '/users') {
//   //   ctx.throw(401)
//   // }
//   await next()
// }

router.get('/', userController.list)

router.get('/:id', userController.query)

router.post('/', userController.create);

// 修改
router.put('/', userController.update)

router.delete('/:id', userController.delete)

module.exports = router
