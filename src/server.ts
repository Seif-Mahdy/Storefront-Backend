import express from 'express'
import userRoutes from './handlers/users'
import * as dotenv from 'dotenv'

const app = express()
const port = 3000

dotenv.config()

app.use(express.json())

userRoutes(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

export default app
