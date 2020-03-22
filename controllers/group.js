const Router = require('koa-router')
const passport = require('koa-passport')

const Group = require('../models/Group')

const router = new Router().prefix('/groups')

router.post('/', passport.authenticate('jwt', {session: false}), async (ctx) => {
    const {user} = ctx.state
    ctx.body = await new Group({owner: user}).save()
    ctx.status = 201
})

router.get('/', passport.authenticate('jwt', {session: false}), async (ctx) => {
    const {user} = ctx.state
    const q = { $or: [{ owner: user }, { members: user }] }
    ctx.body = await Group.find(q).sort({ createdDate: -1 })
})

router.get('/:id', passport.authenticate('jwt', {session: false}), async (ctx) => {
    const {user} = ctx.state
    const {id} = ctx.params
    const group = await Group.findOne({_id: id, $or: [{owner: user}, { members: user }]})
    if (group) {
        ctx.body = group
    } else {
        ctx.throw(404, 'Group has not been found')
    }
})

router.put('/', passport.authenticate('jwt', {session: false}), async (ctx) => {

})

router.delete('/:_id', passport.authenticate('jwt', {session: false}), async (ctx) => {})


module.exports = router.routes()
