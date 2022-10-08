import { Product, ProductsModel } from './../models/products'
import { Verify } from '../helpers/jwt-helper'
import express, { Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'

const products = new ProductsModel()

const show = async (req: Request, res: Response) => {
  try {
    if (Verify(req)) {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const id: number = parseInt(req.params.id)
      const product = await products.show(Number(id))
      if (!product) {
        return res
          .status(404)
          .json({ err: "Couldn't find a product with the given id" })
      }
      res.status(200).json({ product })
    } else {
      return res.status(403).json({ err: 'Token is invalid or expired' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}
const create = async (req: Request, res: Response) => {
  try {
    if (Verify(req)) {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const { name, price } = req.body
      const product: Product = { name: name, price: price }
      const newProduct = await products.create(product)
      res.status(201).json({ product: newProduct })
    } else {
      return res.status(403).json({ err: 'Token is invalid or expired' })
    }
  } catch (err) {
    res.status(500).json({ err })
  }
}

//routes
const productsRoutes = (app: express.Application) => {
  app.post(
    '/products',
    body('name').isString(),
    body('price').isNumeric(),
    create
  ),
    app.get('/products/:id', param('id').isNumeric(), show)
}

export default productsRoutes
