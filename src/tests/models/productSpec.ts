import { Product, ProductsModel } from '../../models/products'

const testProduct: Product = { name: 'p1', price: 20 }
const productModel = new ProductsModel()
let product: Product

describe('Testing products Model', () => {
  it('should have a create method', () => {
    expect(productModel.create).toBeDefined()
  })
  it('create method should create a product and return it', async () => {
    product = await productModel.create(testProduct)
    expect({ name: product.name, price: product.price }).toEqual({
      ...testProduct,
    })
  })
  it('should have a show method', () => {
    expect(productModel.show).toBeDefined()
  })
  it('create method should return a product if exists', async () => {
    const p = await productModel.show(Number(product.id))
    expect({ name: p.name, price: p.price }).toEqual({ ...testProduct })
  })
})
