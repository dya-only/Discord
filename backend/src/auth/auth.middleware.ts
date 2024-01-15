import { AuthService } from './auth.service'
import { Injectable, type NestMiddleware } from '@nestjs/common'
import { type NextFunction, type Request, type Response } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (
    private readonly authService: AuthService
  ) {}

  public use (req: Request, res: Response, next: NextFunction): void {
    const { TOKEN: token } = req.cookies

    if (token !== undefined) {
      const userId = this.authService.verifyToken(token)
      res.locals.userId = userId
    }

    next()
  }
}