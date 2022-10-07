import { UsersModel } from '../models/users'
import express, { Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'
import { Sign, Verify } from '../helpers/jwt-helper'

dotenv.config()
const { SALT_ROUNDS, BCRYPT_PASSWORD } = process.env

export type User = {
  id: number
  firstName: string
  lastName: string
  password: string
}

const users = new UsersModel()

const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      firstName,
      lastName,
      password,
    }: { firstName: string; lastName: string; password: string } = req.body

    // Hashing the password before adding it to DB
    const hash = bcrypt.hashSync(
      password + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    )
    const newUser = await users.create(firstName, lastName, hash)
    const token = Sign(newUser.id)
    res.status(201).json({ user: newUser, token: token })
  } catch (error) {
    const e = error as Error
    if (e.message.includes('Failed to add the student')) {
      res.status(500).json(e.message)
    } else {
      res.status(401).json(e.message)
    }
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      firstName,
      lastName,
      password,
    }: { firstName: string; lastName: string; password: string } = req.body
    const existingUser = await users.getUserByFullName(firstName, lastName)
    if (!existingUser) {
      return res.status(401).json('wrong credentials')
    }
    if (
      !bcrypt.compareSync(password + BCRYPT_PASSWORD, existingUser.password)
    ) {
      return res.status(403).json('wrong credentials')
    }
    const token = Sign(existingUser.id)
    res.json(token)
  } catch (err) {
    res.status(500).json(err)
  }
}

const show = async (req: Request, res: Response) => {
  try {
    Verify(req)
    const id: number = parseInt(req.params.id)
    const user = await users.show(id)
    if (!user)
      return res.status(404).json("Couldn't find a user with the provided id")
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json(err)
  }
}
const create = async (req: Request, res: Response) => {
  try {
    Verify(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      firstName,
      lastName,
      password,
    }: { firstName: string; lastName: string; password: string } = req.body
    const newUser = await users.create(firstName, lastName, password)
    const token = Sign(newUser.id)
    res.status(201).json({ user: newUser, token: token })
  } catch (err) {
    res.status(500).json({ err })
  }
}
const index = async (req: Request, res: Response) => {
  try {
    Verify(req)
    const allUsers = await users.index()
    res.status(200).json({ users: allUsers })
  } catch (err) {
    res.status(500).json({ err })
  }
}

//routes
const userRoutes = (app: express.Application) => {
  app.post(
    '/users/register',
    body('firstName').isString(),
    body('lastName').isString(),
    body('password').isStrongPassword(),
    register
  ),
    app.post(
      '/users/login',
      body('firstName').isString(),
      body('lastName').isString(),
      body('password').isStrongPassword(),
      login
    ),
    app.post(
      '/users/',
      body('firstName').isString(),
      body('lastName').isString(),
      body('password').isStrongPassword(),
      create
    ),
    app.get('/users/:id', param('id').isNumeric(), show)
  app.get('/users/', index)
}

export default userRoutes
