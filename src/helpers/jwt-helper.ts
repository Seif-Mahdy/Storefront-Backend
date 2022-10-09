import { Request } from 'express'
import { verify, sign, decode, JwtPayload } from 'jsonwebtoken'

const secretToken = process.env.TOKEN_SECRET as string

const Verify = (req: Request): boolean => {
  const authorizationHeader = req.headers.authorization
  const token = authorizationHeader?.split(' ')[1]
  try {
    verify(token as string, secretToken)
    return true
  } catch {
    return false
  }
}

const Sign = (userId: number) => {
  return sign({ user: { userId } }, secretToken)
}

const Decode = (req: Request): number => {
  const authorizationHeader = req.headers.authorization
  const token = authorizationHeader?.split(' ')[1]
  const decoded: JwtPayload = decode(String(token)) as JwtPayload

  return decoded.user.userId
}
export { Verify, Sign, Decode }
