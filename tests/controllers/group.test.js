const helpers = require('../helpers')
const User = require('../../models/User')
const Group = require('../../models/Group')

describe('Group API', async () => {
    let authHeader
    before(async () => {
        const testUser = {
            name: 'Test Test',
            email: 'test@test.com',
            password: 'password'
        }
        await helpers.request.post('auth/register', {
            json: true,
            body: testUser
        })
        const res = await helpers.request.post('auth/login', {
            json: true,
            body: testUser
        })
        authHeader = {
            'Authorization': res.body.token
        }
    })
    beforeEach(async () => {
        await Group.remove()
    })
    describe('Group /groups', () => {
        it('creates a group', async () => {
            const res = await helpers.request.post('groups', {
                json: true,
                headers: authHeader
            })
            const user = await User.findOne()
            res.statusCode.should.eql(201)
            res.body._id.should.be.a.String()
            res.body.owner._id.should.eql(user.id)
            new Date(res.body.createdDate).should.be.a.Date()
        })
        it('Get groups', async () => {
            await helpers.request.post('groups', {
                json: true,
                headers: authHeader
            })
            const res = await helpers.request.get('groups', {
                json: true,
                headers: authHeader
            })
            res.body.length.should.eql(1)
        })
        it('Get group by :id', async () => {
            let res = await helpers.request.post('groups', {
                json: true,
                headers: authHeader
            })
            let group = res.body
            res = await helpers.request.get(`groups/${group._id}`, {
                json: true,
                headers: authHeader
            })
            res.body._id.should.eql(group._id)
        })
    })
})