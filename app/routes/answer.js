const Router = require('koa-router')
const jwt = require('koa-jwt')

const { privateKey } = require('../config')
const answerController = require('../controllers/answer')

const auth = jwt({ secret: privateKey })

const router = new Router({
  prefix: '/question/:questionId/answer'
})


router.get('/', answerController.list)

router.get('/:id', answerController.checkExist, answerController.queryById)

router.post('/', auth, answerController.create)

router.patch('/:id/update', auth, answerController.checkExist, answerController.checkAnswer, answerController.update)

router.delete('/:id', auth, answerController.checkExist, answerController.checkAnswer, answerController.delete)

module.exports = router
