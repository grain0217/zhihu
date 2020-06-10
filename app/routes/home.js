const Router = require('koa-router');
const router = new Router();
const homeController = require('../controllers/home')

router.get('/', homeController.index)

router.post('/upload', homeController.upload)

module.exports = router
