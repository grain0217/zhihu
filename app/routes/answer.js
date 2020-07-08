const Router = require('koa-router')
const jwt = require('koa-jwt')

const { privateKey } = require('../config')
const answerCtl = require('../controllers/answer')

const auth = jwt({ secret: privateKey })

const router = new Router({
  prefix: '/answer'
})

// router.get('', )

module.exports = router
