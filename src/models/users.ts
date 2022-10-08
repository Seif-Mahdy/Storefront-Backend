import client from '../database'

export type User = {
  id?: number
  first_name: string
  last_name: string
  password: string
}

export class UsersModel {
  async index(): Promise<User[]> {
    try {
      const connection = await client.connect()
      const sql = 'SELECT * FROM users'
      const result = await connection.query(sql)
      connection.release()
      return result.rows
    } catch (error) {
      throw new Error(
        `Failed to get the users with the following error: ${error}`
      )
    }
  }
  async getUserByFullName(firstName: string, lastName: string): Promise<User> {
    try {
      const connection = await client.connect()
      const sql = 'SELECT * FROM users WHERE first_name=($1) AND last_name=($2)'
      const result = await connection.query(sql, [firstName, lastName])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to get the user with the following error: ${error}`
      )
    }
  }
  async show(id: number): Promise<User> {
    try {
      const connection = await client.connect()
      const sql = 'SELECT * FROM users WHERE id=($1)'
      const result = await connection.query(sql, [id])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to get the user with the following error: ${error}`
      )
    }
  }
  async create(user: User): Promise<User> {
    try {
      const connection = await client.connect()
      const sql =
        'INSERT INTO users (first_name, last_name, password) VALUES($1,$2,$3) RETURNING *'
      const result = await connection.query(sql, [
        user.first_name,
        user.last_name,
        user.password,
      ])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to add the user with the following error: ${error}`
      )
    }
  }
}
