import supertest from 'supertest'
import app from '../../server'
import { Order } from '../../models/orders'
import { User } from '../../models/users'
import { Product } from '../../models/products'
const request = supertest(app)

let token: string
let user: User = {
  first_name: 'john',
  last_name: 'doe',
  username: 'johndoe',
  password: 'Strong@123456',
}
const dummyProducts: Product[] = [
  { name: 'tomato', price: 20 },
  { name: 'potato', price: 10 },
]
describe('Testing orders endpoint: /orders', () => {
  beforeAll(async () => {
    //Register a user to be used for authentication
    await request
      .post('/users/register')
      .send(user)
      .then((res) => {
        token = JSON.parse(res.text).token
        user = JSON.parse(res.text).user
      })
    // Add products to be added to the order
    dummyProducts.forEach(async (p) => {
      await request
        .post('/products/')
        .send(p)
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          p = JSON.parse(res.text).product
        })
    })
  })
  const dummyOrder: Order = {
    status: 'Active',
    user_id: Number(user.id),
    products: dummyProducts.map((p) => {
      return p.id
    }) as number[],
    quantities: [10, 5],
  }
  it('Create endpoint should return 201 and create an order given a valid token', async () => {
    await request
      .post('/orders')
      .send(dummyOrder)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
  })
  it('Create endpoint should return 403 given an invalid token', async () => {
    await request
      .post('/orders')
      .send(dummyOrder)
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
  it('getActiveOrderByUser endpoint should return 200 and the order given an invalid token', async () => {
    await request
      .post(`/orders/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
  it('getActiveOrderByUser endpoint should return 403 given an invalid token', async () => {
    await request
      .post(`/orders/${user.id}`)
      .set('Authorization', `Bearer invalid-token`)
      .expect(404)
  })
  it("getActiveOrderByUser endpoint should return 404 if the passed user id doesn't have any active orders or the user id doesn't exist", async () => {
    await request
      .post(`/orders/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
  afterAll(async () => {
    //delete the created user
    await request
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
    //delete the created products
    dummyProducts.forEach(async (p) => {
      await request.delete(`/products/${p.id}`)
    })
    //delete the order
    await request.delete(`/orders/${dummyOrder.id}`)
  })
})
