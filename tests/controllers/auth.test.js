const helpers = require('../helpers')
const User = require('../../models/User')
const UserCredential = require('../../models/UserCredential')

describe('User Auth API', async () => {
    const testUser = {
        firstName: 'FirstName',
        lastName: 'LastName',
        password: 'password',
        email: 'test@test.com'
    }
    beforeEach(async () => {
        await User.remove()
        await UserCredential.remove()
    })
    describe('POST /auth/register', () => {
        it('registers user', async () => {
            const res = await helpers.request.post('auth/register', {
                json: true,
                body: testUser
            })
            res.statusCode.should.eql(201)
            const createdUserCredential = await UserCredential.findOne({ login: testUser.email })
            const createdUser = await User.findOne({ _id: createdUserCredential.user })
            createdUserCredential.password.should.be.a.String()
            createdUserCredential.login.should.eql(testUser.email)
            createdUserCredential.createdDate.should.be.a.Date()
            createdUser.firstName.should.eql(testUser.firstName)
            createdUser.lastName.should.eql(testUser.lastName)
            createdUser.email.should.eql(testUser.email)
            createdUser.createdDate.should.be.a.Date()
        })
        it('registers one user twice', async () => {
            await helpers.request.post('auth/register', {
                json: true,
                body: testUser
            })
            const res = await helpers.request.post('auth/register', {
                json: true,
                body: testUser
            })
            res.statusCode.should.eql(400)
            res.body.error.should.eql('Email already exists')
        })
    })
    describe('POST /auth/login', () => {
        it('logs in user', async () => {
            await helpers.request.post('auth/register', {
                json: true,
                body: testUser
            })
            const res = await helpers.request.post('auth/login', {
                json: true,
                body: testUser
            })
            res.statusCode.should.eql(200)
            res.body.token.should.containEql('Bearer ')
        })
        it('logs in with nonexistent user', async () => {
            const res = await helpers.request.post('auth/login', {
                json: true,
                body: {
                    email: 'nonexistent@test.com',
                    password: 'password'
                }
            })
            res.statusCode.should.eql(400)
            res.body.error.should.eql('User with this email does not exist')
        })
        it('logs in with incorrect password', async () => {
            await helpers.request.post('auth/register', {
                json: true,
                body: testUser
            })
            const res = await helpers.request.post('auth/login', {
                json: true,
                body: {
                    email: testUser.email,
                    password: 'wrongpassword'
                }
            })
            res.statusCode.should.eql(400)
            res.body.error.should.eql('Password incorrect')
        })
    })
})