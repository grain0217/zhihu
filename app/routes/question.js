const Router = require('koa-router')
const jwt = require('koa-jwt')

const { privateKey } = require('../config')
const questionController = require('../controllers/question')

const router = new Router({
  prefix: '/question'
})

const auth = jwt({ secret: privateKey })

router.get('/', questionController.list)

router.get('/:id', questionController.checkExist, questionController.queryById)

router.post('/', auth, questionController.create)

router.patch('/:id/update', auth, questionController.checkExist, questionController.checkQuestioner, questionController.update)

router.delete('/:id', auth, questionController.checkExist, questionController.checkQuestioner, questionController.delete)

module.exports = router