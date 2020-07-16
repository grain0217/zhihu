const Router = require('koa-router')
const jwt = require('koa-jwt')

const { privateKey } = require('../config')
const commentController = require('../controllers/comment')

const auth = jwt({ secret: privateKey })

const router = new Router({
  prefix: '/question/:questionId/answer/:answerId/comment'
})


router.get('/', commentController.list)

router.get('/:id', commentController.checkExist, commentController.queryById)

router.post('/', auth, commentController.create)

router.delete('/:id', auth, commentController.checkExist, commentController.checkCommentator, commentController.delete)

module.exports = router
