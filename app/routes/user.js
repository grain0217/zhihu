const Router = require('koa-router');

const router = new Router({
  prefix: '/users'
});
const userController = require('../controllers/user')

router.get('/', userController.list)

// 查
router.get('/:id', userController.query)

// 增
router.post('/', userController.create);

// 改
// put => 全部替换； patch => 部分替换
router.patch('/:id', userController.update)

// 删
router.delete('/:id', userController.delete)

module.exports = router
