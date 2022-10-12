import supertest from 'supertest'
import app from '../../server'
import { Product } from '../../models/products'
import { User } from '../../models/users'
const request = supertest(app)

let token: string
let user: User = {
  first_name: 'john',
  last_name: 'doe',
  username: 'johndoe',
  password: 'Strong@123456',
}

describe('Testing products endpoint: /products', () => {
  let dummyProduct: Product = { name: 'tomato', price: 20 }
  beforeAll(async () => {
    await request
      .post('/users/register')
      .send(user)
      .then((res) => {
        token = JSON.parse(res.text).token
        user = JSON.parse(res.text).user
      })
  })
  it('Create endpoint should return 201 and create a product given a valid token', async () => {
    await request
      .post('/products')
      .send(dummyProduct)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then((res) => {
        dummyProduct = JSON.parse(res.text).product
      })
  })
  it('Create endpoint should return 403 given an invalid token', async () => {
    await request
      .post('/products')
      .send(dummyProduct)
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
  it('Read endpoint should return 200 and the product with the given id given an valid token', async () => {
    await request
      .get(`/products/${dummyProduct.id}`)
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
      .get(`/products/${dummyProduct.id}`)
      .set('Authorization', `Bearer invalid-token`)
      .expect(403)
  })
  afterAll(async () => {
    //delete the user
    await request
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    //delete the product
    await request
      .delete(`/products/${dummyProduct.id}`)
      .set('Authorization', `Bearer ${token}`)
  })
})
