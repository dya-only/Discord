import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Chat } from './entities/chat.entity'
import { CreateChatDto } from './dto/CreateChatDto'
import { UpdateChatDto } from './dto/UpdateChatDto'

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

  public async updateChat (userId: number, chatId: number, updateChatDto: UpdateChatDto): Promise<void> {
    const chat = await this.chats.findOne({ where: { id: chatId } })
    if (chat.userId !== userId) {
      throw new NotFoundException({
        success: false,
        message: 'Invalid to update'
      })
    }

    await this.chats.update(chatId, {
      message: () => updateChatDto.message
    })
  }

  public async deleteChat (userId: number, chatId: number): Promise<void> {
    const chat = await this.chats.findOne({ where: { id: chatId } })
    if (chat.userId !== userId) {
      throw new NotFoundException({
        success: false,
        message: 'Invalid to delete'
      })
    }

    await this.chats.delete(chatId)
  }
}