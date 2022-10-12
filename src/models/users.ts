import client from '../database'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()
const { SALT_ROUNDS, BCRYPT_PASSWORD } = process.env

export type User = {
  id?: number
  username: string
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
  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const connection = await client.connect()
      const sql = 'SELECT * FROM users WHERE username=($1)'
      const result = await connection.query(sql, [username])
      connection.release()
      const user = result.rows[0]
      if (user) {
        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
          return user
        }
      }
      return null
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
      // Hashing the password before adding it to DB
      const hash = bcrypt.hashSync(
        user.password + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      )
      const connection = await client.connect()
      const sql =
        'INSERT INTO users (first_name, last_name, username, password) VALUES($1,$2,$3,$4) RETURNING *'
      const result = await connection.query(sql, [
        user.first_name,
        user.last_name,
        user.username,
        hash,
      ])
      connection.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(
        `Failed to add the user with the following error: ${error}`
      )
    }
  }
  async delete(id: number): Promise<void> {
    try {
      const connection = await client.connect()
      const sql = 'DELETE FROM users WHERE id=($1)'
      await connection.query(sql, [id])
      connection.release()
    } catch (error) {
      throw new Error(
        `Failed to delete the user with the following error: ${error}`
      )
    }
  }
}
