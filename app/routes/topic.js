const topicController = require('../controllers/topic')
const Router = require('koa-router')
const jwt = require('koa-jwt')
const { privateKey } = require('../config')

const router = new Router({
  prefix: '/topic'
})

// 需要登录
const auth = jwt({ secret: privateKey })

router.get('/', topicController.list)

router.post('/', auth, topicController.create)

router.get('/:id', topicController.queryById)

router.patch('/:id', auth, topicController.update)

module.exports = router
