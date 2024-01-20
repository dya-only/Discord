import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Chat } from './entities/chat.entity'
import { CreateChatDto } from './dto/CreateChatDto'
import { UpdateChatDto } from './dto/UpdateChatDto'
import { CreateRoomDto } from './dto/CreateRoomDto'
import { Room } from './entities/room.entity'
import { Channel } from './entities/channel.entity'

@Injectable()
export class EventsService {
  constructor (
    @InjectRepository(Chat)
    private readonly chats: Repository<Chat>,

    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,

    @InjectRepository(Channel)
    private readonly channels: Repository<Channel>
  ) {}

  public async createChat(userId: number, createChatDto: CreateChatDto): Promise<void> {
    await this.chats.insert({
      message: createChatDto.message,
      channelId: createChatDto.channelId,
      userId
    })
  }

  public async findChat(channelId: number): Promise<Chat[]> {
    return await this.chats.find({
      where: { channelId }
    })
  }

  public async updateChat(userId: number, chatId: number, updateChatDto: UpdateChatDto): Promise<void> {
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

  public async deleteChat(userId: number, chatId: number): Promise<void> {
    const chat = await this.chats.findOne({ where: { id: chatId } })
    if (chat.userId !== userId) {
      throw new NotFoundException({
        success: false,
        message: 'Invalid to delete'
      })
    }

    await this.chats.delete(chatId)
  }

  
  // ---


  public async createRoom(userId: number, createRoomDto: CreateRoomDto): Promise<void> {
    await this.rooms
  }
}