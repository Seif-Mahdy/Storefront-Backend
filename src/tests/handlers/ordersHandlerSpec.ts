import { decode, JwtPayload } from 'jsonwebtoken'
import supertest from 'supertest'
import app from '../../server'
import { Order } from '../../models/orders'
const request = supertest(app)

let token: string
let userId: number
describe('Testing orders endpoint: /orders', () => {
  beforeAll(async () => {
    await request
      .post('/users/login')
      .send({
        username: 'johndoe',
        password: 'Strong@2892022',
      })
      .then((res) => {
        token = JSON.parse(res.text).token
        const decoded = decode(token) as JwtPayload
        userId = decoded.user.userId
      })
  })
  it('Create endpoint should return 201 and create an order given a valid token', async () => {
    const dummyOrder: Order = { status: 'Active', user_id: userId }
    await request
      .post('/orders')
      .send(dummyOrder)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
  })
  it('Create endpoint should return 403 given an invalid token', async () => {
    const dummyOrder: Order = { status: 'Active', user_id: userId }
    await request
      .post('/orders')
      .send(dummyOrder)
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
  it('getActiveOrderByUser endpoint should return 200 and the order given an invalid token', async () => {
    await request
      .post(`/orders/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
  it('getActiveOrderByUser endpoint should return 403 given an invalid token', async () => {
    await request
      .post(`/orders/${userId}`)
      .set('Authorization', `Bearer invalid-token`)
      .expect(404)
  })
  it("getActiveOrderByUser endpoint should return 404 if the passed user id doesn't have any active orders or the user id doesn't exist", async () => {
    await request
      .post(`/orders/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})
