import { Order, OrderModel } from '../models/orders'
import express, { Request, Response } from 'express'
import { Decode, Verify } from '../helpers/jwt-helper'
import { body, param, validationResult } from 'express-validator'

const orders = new OrderModel()

const getActiveOrderByUser = async (req: Request, res: Response) => {
  try {
    if (Verify(req)) {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
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

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
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

const deleteOrder = async (req: Request, res: Response) => {
  try {
    if (Verify(req)) {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const id = req.params.id
      await orders.delete(Number(id))
      res.status(200).json({ msg: 'Order deleted successfully' })
    } else {
      res.status(403).json({ err: 'Token is invalid or expired' })
    }
  } catch (err) {
    res.status(500).json({ err })
  }
}
//routes
const ordersRoutes = (app: express.Application) => {
  app.get(
    '/orders/:userId',
    param('userId').exists().isNumeric(),
    getActiveOrderByUser
  )
  app.delete('/orders/:id', param('id').exists().isNumeric(), deleteOrder)
  app.post(
    '/orders/',
    body('products').exists(),
    body('quantities').exists(),
    create
  )
}

export default ordersRoutes
