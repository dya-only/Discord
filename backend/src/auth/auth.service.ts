import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginByPasswordDto } from './dto/LoginByPasswordDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  public generateToken(userId: number): string {
    return this.jwtService.sign({ userId })
  }

  public verifyToken(token: string): string {
    try {
      return this.jwtService.verify(token).userId
    } catch (e) {
      if (e instanceof JsonWebTokenError)
        throw new NotAcceptableException('TOKEN_MALFORMED')

      if (e instanceof TokenExpiredError)
        throw new UnauthorizedException('TOKEN_EXPIRED')

      throw new InternalServerErrorException('JWT_SERVICE_ERROR')
    }
  }

  public async loginByPassword (dto: LoginByPasswordDto): Promise<string> {
    const user = await this.usersService.findUserByLogin(dto.login, true)
    if (user === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'User or Password Invalid'
      })
    }

    const password = await this.usersService.hashPassword(dto.password, user.salt)
    if (password !== user.password) {
      throw new NotFoundException({
        success: false,
        message: 'User or Password Invalid'
      })
    }

    return this.generateToken(user.id)
  }
}