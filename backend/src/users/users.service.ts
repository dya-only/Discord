import { Injectable } from '@nestjs/common'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/CreateUserDto'
import { UpdateUserDto } from './dto/UpdateUserDto'
import { randomBytes } from 'crypto'
import * as shajs from 'sha.js'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>
  ) { }

  public async createUser(createUserDto: CreateUserDto): Promise<void> {
    const salt = randomBytes(4).toString('hex')
    const password = await this.hashPassword(createUserDto.password, salt)

    await this.users.insert({
      email: createUserDto.email,
      login: createUserDto.login,
      nickname: createUserDto.nickname,
      bio: createUserDto.bio,
      avatar: 'default.png',
      status: 'online',
      password,
      salt
    })
  }

  public async checkLoginClaim(login: string): Promise<boolean> {
    return await this.findUserByLogin(login) !== undefined
  }

  public async checkEmailClaim(email: string): Promise<boolean> {
    return await this.findUserByEmail(email) !== undefined
  }

  public async findUserByLogin(login: string, secret = false): Promise<User | undefined> {
    return await this.users.findOne({
      where: { login },
      select: {
        id: true,
        email: true,
        login: true,
        nickname: true,
        bio: true,
        rooms: true,
        createdAt: true,
        avatar: true,
        password: secret,
        salt: secret,
      },
      relations: {
        rooms: true
      }
    }) ?? undefined
  }

  public async findUserByEmail(email: string, secret = false): Promise<User | undefined> {
    return await this.users.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        login: true,
        nickname: true,
        bio: true,
        rooms: true,
        createdAt: true,
        avatar: true,
        password: secret,
        salt: secret
      },
      relations: {
        rooms: true,
      }
    }) ?? undefined
  }

  public async findAllUser(): Promise<User[]> {
    return await this.users.find()
  }

  public async findUser(id: number): Promise<User | undefined> {
    return await this.users.findOne({
      where: { id },
      relations: {
        rooms: true
      }
    }) ?? undefined
  }

  public async updateUser(id: number, updateUserDto: UpdateUserDto, filename: string): Promise<void> {
    await this.users.update(id, {
      bio: updateUserDto.bio,
      nickname: updateUserDto.nickname,
      avatar: filename !== undefined ? filename : 'default.png'
    }
    )
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return shajs('SHA512').update(salt + password).digest('hex')
  }

  public async connect(id: number): Promise<void> {
    await this.users.update(id, {
      status: 'online'
    })
  }

  public async disconnect(id: number): Promise<void> {
    await this.users.update(id, {
      status: 'offline'
    })
  }
}
