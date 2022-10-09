import { Order, OrderModel } from '../models/orders'
import express, { Request, Response } from 'express'
import { Decode, Verify } from '../helpers/jwt-helper'
import { param } from 'express-validator'

const orders = new OrderModel()

const getActiveOrderByUser = async (req: Request, res: Response) => {
  try {
    if (Verify(req)) {
      const userId = req.params.userId
      const order = await orders.show(Number(userId))
      if (!order) {
        res.status(404).json({ err: 'This user has no active orders' })
      } else {
        res.status(200).json({ order })
      }
    } else {
      res.status(403).json({ err: 'Token is invalid or expired' })
    }
  } catch (err) {
    res.status(500).json({ err })
  }
}

const create = async (req: Request, res: Response) => {
  try {
    if (Verify(req)) {
      const {
        products,
        quantities,
      }: { products: number[]; quantities: number[]; userId: number } = req.body

      const loggedInUserId = Decode(req)

      const order: Order = { user_id: loggedInUserId, status: 'Active' }
      const createdOrder: Order = await orders.create(order)
      for (let i = 0; i < products.length; i++) {
        await orders.addProduct(
          products[i],
          Number(createdOrder.id),
          quantities[i]
        )
      }
      createdOrder.products = products
      createdOrder.quantities = quantities
      res.status(201).json({ order: createdOrder })
    } else {
      res.status(403).json({ err: 'Token is invalid or expired' })
    }
  } catch (err) {
    res.status(500).json({ err })
  }
}

//routes
const ordersRoutes = (app: express.Application) => {
  app.get('/orders/:userId', param('userId').isNumeric(), getActiveOrderByUser)
  app.post(
    '/orders/',
    param('products').isArray(),
    param('quantities').isArray(),
    create
  )
}

export default ordersRoutes
