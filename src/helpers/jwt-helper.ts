import { Request } from 'express'
import { verify, sign } from 'jsonwebtoken'

const secretToken = process.env.TOKEN_SECRET as string

function Verify(req: Request): boolean {
  const authorizationHeader = req.headers.authorization
  const token = authorizationHeader?.split(' ')[1]
  try {
    verify(token as string, secretToken)
    return true
  } catch {
    return false
  }
}

function Sign(userId: number) {
  return sign({ user: { userId } }, secretToken)
}

export { Verify, Sign }
