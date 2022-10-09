import supertest from 'supertest'
import app from '../../server'
import { Product } from '../../models/products'
const request = supertest(app)

let token: string

describe('Testing products endpoint: /products', () => {
  const dummyProduct: Product = { name: 'tomato', price: 20 }
  beforeAll(async () => {
    await request
      .post('/users/login')
      .send({
        username: 'johndoe',
        password: 'Strong@2892022',
      })
      .then((res) => {
        token = JSON.parse(res.text).token
      })
  })
  it('Create endpoint should return 201 and create a product given a valid token', async () => {
    await request
      .post('/products')
      .send(dummyProduct)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
  })
  it('Create endpoint should return 403 given an invalid token', async () => {
    const p: Product = { name: 'potato', price: 10 }
    await request
      .post('/products')
      .send(p)
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
  it('Read endpoint should return 200 and the product with the given id given an valid token', async () => {
    await request
      .get('/products/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
  it("Read endpoint should return 404 id the product with the given id doesn't exist", async () => {
    await request
      .get('/products/10')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
  it('Read endpoint should return 403 given an invalid token', async () => {
    await request
      .get('/products/1')
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
})
