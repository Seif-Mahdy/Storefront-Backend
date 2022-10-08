import supertest from 'supertest'
import app from '../../../server'
import { User } from '../../../models/users'

const request = supertest(app)

fdescribe('Testing user endpoint: /users', () => {
  const dummyUser: User = {
    first_name: 'john',
    last_name: 'doe',
    password: 'Strong@2892022',
  }
  let token: string
  it('Register endpoint should create a user and returns a token and the created user', async () => {
    await request
      .post('/users/register')
      .send(dummyUser)
      .expect(201)
      .then((res) => {
        const data = JSON.parse(res.text)
        token = data.token
      })
  })
  it('Register endpoint should return 400 if any of the parameters are missing', async () => {
    await request.post('/users/register').expect(400)
  })
  it('Login endpoint should return a token if the passed creds are valid', async () => {
    await request
      .post('/users/login')
      .send(dummyUser)
      .expect(200)
      .then((res) => {
        const data = JSON.parse(res.text)
        token = data.token
      })
  })
  it('Login endpoint should return 403 if the passed creds are not valid', async () => {
    const userWithWrongCreds: User = {
      first_name: 'test',
      last_name: 'test',
      password: 'test',
    }
    await request.post('/users/login').send(userWithWrongCreds).expect(403)
  })
  it('Index endpoint should return 200 given a valid token', async () => {
    await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
  it('Index endpoint should return 403 given an invalid token', async () => {
    await request
      .get('/users')
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
  it('Read endpoint should return 200 given a valid token and an existing user id', async () => {
    await request
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
  it('Read endpoint should return 404 given a valid token and an none-existing user id', async () => {
    await request
      .get('/users/10')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
  it('Read endpoint should return 403 given an invalid token', async () => {
    await request
      .get('/users/10')
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
  it('Create endpoint should return 201 and create a user given a valid token', async () => {
    const user: User = {
      first_name: 'test',
      last_name: 'test',
      password: 'Strong@2892022',
    }
    await request
      .post('/users')
      .send(user)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
  })
  it('Create endpoint should return 403 given an invalid token', async () => {
    const user: User = {
      first_name: 'test',
      last_name: 'test',
      password: 'test',
    }
    await request
      .post('/users')
      .send(user)
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
})
