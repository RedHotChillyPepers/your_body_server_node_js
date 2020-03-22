const Router = require('koa-router')

const auth = require('./auth')
const group = require('./group')

const router = new Router().prefix('/api')

router.use(auth, group)

module.exports = router