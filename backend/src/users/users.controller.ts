import { Body, ConflictException, Controller, Get, NotFoundException, Param, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/CreateUserDto'
import { UpdateUserDto } from './dto/UpdateUserDto'
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/auth.guard'
import { Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) { }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    const isLoginClaimed = await this.usersService.checkLoginClaim(createUserDto.login)
    if (isLoginClaimed) {
      throw new ConflictException({
        success: false,
        message: `already existed login: ${createUserDto.login}`
      })
    }

    await this.usersService.createUser(createUserDto)

    return {
      success: true
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  public async findAllUser() {
    const users = await this.usersService.findAllUser()

    return {
      success: true,
      body: users
    }
  }

  @Get(':userId')
  @UseGuards(AuthGuard)
  public async findUser(@Param('userId') userId: number) {
    const user = await this.usersService.findUser(userId)

    if (user === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'User not found.'
      })
    }

    return {
      success: true,
      body: user
    }
  }

  @Get('@me')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  public async findMe(@Res({ passthrough: true }) res: Response) {
    const userId = res.locals.userId
    return await this.findUser(userId)
  }

  @Patch(':userId')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseGuards(AuthGuard)
  public async updateUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.usersService.findUser(userId)
    if (user === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'User not found.'
      })
    }

    await this.usersService.updateUser(userId, updateUserDto, avatar.filename)

    return {
      success: true
    }
  }

  @Get('connect')
  @UseGuards(AuthGuard)
  public async connect(@Res({ passthrough: true }) res: Response) {
    const userId = res.locals.userId
    await this.usersService.connect(userId)

    return {
      success: true
    }
  }

  @Get('disconnect')
  @UseGuards(AuthGuard)
  public async disconnect(@Res({ passthrough: true }) res: Response) {
    const userId = res.locals.userId
    await this.usersService.disconnect(userId)
  }
}
