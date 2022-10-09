import client from '../database'

export type Order = {
  id?: number
  name: string
  products: number[]
  quantities: number[]
  status: 'Active' | 'Complete'
}

export class OrderModel {
  async show(userId: number): Promise<Order> {
    try {
      const connection = await client.connect()
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=Active'
      const result = await connection.query(sql, [userId])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to get the order with the following error: ${error}`
      )
    }
  }
  async addProduct(
    productId: number,
    orderId: number,
    quantity: number
  ): Promise<void> {
    try {
      const connection = await client.connect()
      const sql =
        'INSERT INTO products_orders (product_id, order_id, quantity) VALUES($1,$2,$3)'
      const result = await connection.query(sql, [productId, orderId, quantity])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to add the product to the order with the following error: ${error}`
      )
    }
  }
}
