const Router = require('koa-router')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const UserCredential = require('../models/UserCredential')
const SocialNetwork = require('../models/SocialNetwork')
const config = require('../lib/config')

const router = new Router().prefix('/auth')

router.post('/register', async (ctx) => {
    const {firstName, lastName, password, email} = ctx.request.body
    const existsUser = await User.findOne({email})
    if (existsUser) {
        ctx.throw(400, 'Email already exists')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({firstName, lastName, email})
    await user.save()
    await new UserCredential({login: email, password: hash, user}).save()
    ctx.status = 201
})

router.post('/login', async (ctx) => {
    const {email, password} = ctx.request.body
    const userCredential = await UserCredential.findOne({login: email})
    if (!userCredential) {
        ctx.throw(400, 'User with this email does not exist')
    }
    const isMatch = await bcrypt.compare(password, userCredential.password)
    if (!isMatch) {
        ctx.throw(400, 'Password incorrect')
    }
    const user = await User.findOne({_id: userCredential.user})
    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }
    const token = jwt.sign(payload, config.secret, {expiresIn: 3600 * 24})
    ctx.body = {token: `Bearer ${token}`}
})

router.post('/social-register', async (ctx) => {
    const {firstName, lastName, socialNetworkId, socialNetworkType, email} = ctx.request.body
    const socialNetwork = await SocialNetwork.findOne({socialNetworkId, socialNetworkType})
    if (socialNetwork) {
        ctx.throw(400, 'SocialNetwork already exists')
    }
    const userExists = await User.findOne({email})
    if (userExists) {
        ctx.throw(400, 'Email already exists')
    }
    const user = new User({firstName, lastName, email})
    await user.save()
    await new SocialNetwork({socialNetworkId, socialNetworkType, user}).save()
    ctx.status = 201
})

router.post('/social-login', async (ctx) => {
    const {socialNetworkId, socialNetworkType} = ctx.request.body
    const socialNetwork = await SocialNetwork.findOne({socialNetworkId, socialNetworkType})
    if (!socialNetwork) {
        ctx.throw(400, 'User with this social network does not exist')
    }
    const user = await User.findOne({_id: socialNetwork.user})
    const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }
    const token = jwt.sign(payload, config.secret, {expiresIn: 3600 * 24})
    ctx.body = {token: `Bearer ${token}`}
})

module.exports = router.routes()