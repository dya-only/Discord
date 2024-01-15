import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Chat } from './entities/chat.entity'
import { CreateChatDto } from './dto/CreateChatDto'

@Injectable()
export class EventsService {
  constructor (
    @InjectRepository(Chat)
    private readonly chats: Repository<Chat>
  ) {}

  public async createChat (userId: number, createChatDto: CreateChatDto): Promise<void> {
    await this.chats.insert({
      message: createChatDto.message,
      roomKey: createChatDto.roomKey,
      userId
    })
  }

  public async findChat (roomKey: string): Promise<Chat[]> {
    return await this.chats.find({
      where: { roomKey }
    })
  }
}