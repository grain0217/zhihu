const Router = require('koa-router');
const router = new Router();
const homeController = require('../controllers/home')

router.get('/', homeController.index)

module.exports = router
