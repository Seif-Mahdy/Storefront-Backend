import client from '../database'

export type Order = {
  id?: number
  user_id: number
  products?: number[]
  quantities?: number[]
  status: 'Active' | 'Complete'
}

export class OrderModel {
  async show(userId: number): Promise<Order> {
    try {
      const connection = await client.connect()
      const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='Active'"
      const result = await connection.query(sql, [userId])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to get the order with the following error: ${error}`
      )
    }
  }
  async addProduct(productId: number, orderId: number, quantity: number) {
    try {
      const connection = await client.connect()
      const sql =
        'INSERT INTO products_orders (product_id, order_id, quantity) VALUES ($1, $2, $3)'
      const result = await connection.query(sql, [productId, orderId, quantity])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to add the product to the order with the following error: ${error}`
      )
    }
  }
  async create(order: Order) {
    try {
      const connection = await client.connect()
      const sql =
        'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *'
      const result = await connection.query(sql, [order.status, order.user_id])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to create the order with the following error: ${error}`
      )
    }
  }
  async delete(id: number) {
    try {
      const connection = await client.connect()
      const sql = 'DELETE FROM orders WHERE id=($1)'
      await connection.query(sql, [id])
      connection.release()
    } catch (error) {
      throw new Error(
        `Failed to delete the order with the following error: ${error}`
      )
    }
  }
}
