import express from 'express'
import userRoutes from './handlers/users'
import * as dotenv from 'dotenv'
import productsRoutes from './handlers/products'

const app = express()
const port = 3000

dotenv.config()

app.use(express.json())

//register routes
userRoutes(app)
productsRoutes(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

export default app
