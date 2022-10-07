import { Request } from 'express'
import { verify, sign } from 'jsonwebtoken'

const secretToken = process.env.TOKEN_SECRET as string

function Verify(req: Request) {
  const authorizationHeader = req.headers.authorization
  const token = authorizationHeader?.split(' ')[1]
  verify(token as string, secretToken)
}

function Sign(userId: number) {
  return sign({ user: { userId } }, secretToken)
}

export { Verify, Sign }
