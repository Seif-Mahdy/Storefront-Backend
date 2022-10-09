import client from '../database'

export type Product = {
  id?: number
  name: string
  price: number
}
export class ProductsModel {
  async index(): Promise<Product[]> {
    try {
      const connection = await client.connect()
      const sql = 'SELECT * FROM products'
      const result = await connection.query(sql)
      connection.release()
      return result.rows
    } catch (error) {
      throw new Error(
        `Failed to get the products with the following error: ${error}`
      )
    }
  }
  async show(id: number): Promise<Product> {
    try {
      const connection = await client.connect()
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const result = await connection.query(sql, [id])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to get the product with the following error: ${error}`
      )
    }
  }
  async create(product: Product): Promise<Product> {
    try {
      const connection = await client.connect()
      const sql = 'INSERT INTO products (name, price) VALUES($1,$2) RETURNING *'
      const result = await connection.query(sql, [product.name, product.price])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to add the product with the following error: ${error}`
      )
    }
  }
}
