const helpers = require('../helpers')
const User = require('../../models/User')
const SocialNetwork = require('../../models/SocialNetwork')

describe('Social User Auth API', async () => {
    const testUser = {
        firstName: 'FirstName',
        lastName: 'LastName',
        socialNetworkId: 'testSocialNetworkId',
        socialNetworkType: 'vk',
        email: 'test@test.com'
    }
    beforeEach(async () => {
        await User.remove()
        await SocialNetwork.remove()
    })
    describe('POST /auth/social-register', () => {
        it('social registers user', async () => {
            const res = await helpers.request.post('auth/social-register', {
                json: true,
                body: testUser
            })
            res.statusCode.should.eql(201)
            const createdUserSocialNetwork = await SocialNetwork.findOne({ socialNetworkId: testUser.socialNetworkId, socialNetworkType: testUser.socialNetworkType })
            const createdUser = await User.findOne({ _id: createdUserSocialNetwork.user })
            createdUserSocialNetwork.socialNetworkId.should.eql(testUser.socialNetworkId)
            createdUserSocialNetwork.socialNetworkType.should.eql(testUser.socialNetworkType)
            createdUserSocialNetwork.createdDate.should.be.a.Date()
            createdUser.firstName.should.eql(testUser.firstName)
            createdUser.lastName.should.eql(testUser.lastName)
            createdUser.email.should.eql(testUser.email)
            createdUser.createdDate.should.be.a.Date()
        })
        it('social registers one user twice with equal SocialNetwork', async () => {
            await helpers.request.post('auth/social-register', {
                json: true,
                body: testUser
            })
            const res = await helpers.request.post('auth/social-register', {
                json: true,
                body: testUser
            })
            res.statusCode.should.eql(400)
            res.body.error.should.eql('SocialNetwork already exists')
        })
        it('social registers one user twice with equal email', async () => {
            await helpers.request.post('auth/social-register', {
                json: true,
                body: testUser
            })
            const res = await helpers.request.post('auth/social-register', {
                json: true,
                body: {
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    socialNetworkId: 'testSocialNetworkId2',
                    socialNetworkType: 'go',
                    email: 'test@test.com'
                }
            })
            res.statusCode.should.eql(400)
            res.body.error.should.eql('Email already exists')
        })
    })
    describe('POST /auth/social-login', () => {
        it('social logs in user', async () => {
            await helpers.request.post('auth/social-register', {
                json: true,
                body: testUser
            })
            const res = await helpers.request.post('auth/social-login', {
                json: true,
                body: testUser
            })
            res.statusCode.should.eql(200)
            res.body.token.should.containEql('Bearer ')
        })
        it('social logs in with nonexistent user', async () => {
            const res = await helpers.request.post('auth/social-login', {
                json: true,
                body: {
                    socialNetworkId: 'nonexistenSocialNetworkId',
                    socialNetworkType: 'wrongtype'
                }
            })
            res.statusCode.should.eql(400)
            res.body.error.should.eql('User with this social network does not exist')
        })
        it('social logs in with incorrect type', async () => {
            await helpers.request.post('auth/social-register', {
                json: true,
                body: testUser
            })
            const res = await helpers.request.post('auth/social-login', {
                json: true,
                body: {
                    socialNetworkId: testUser.socialNetworkId,
                    socialNetworkType: 'wrongtype'
                }
            })
            res.statusCode.should.eql(400)
            res.body.error.should.eql('User with this social network does not exist')
        })
    })
})