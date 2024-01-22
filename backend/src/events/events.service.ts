import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { small, url } from 'keygen'
import { CreateChatDto } from './dto/CreateChatDto'
import { UpdateChatDto } from './dto/UpdateChatDto'
import { CreateRoomDto } from './dto/CreateRoomDto'
import { Chat } from './entities/chat.entity'
import { Room } from './entities/room.entity'
import { Channel } from './entities/channel.entity'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class EventsService {
  constructor (
    @InjectRepository(User)
    private readonly users: Repository<User>,

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
    let roomKey = url(small)
    if ((await this.rooms.findOne({ where: { roomKey } })) !== undefined) roomKey = url(small)  

    await this.rooms.insert({
      name: createRoomDto.name,
      ownerId: userId,
      roomKey,
      image: 'default.png',
    })

    await this.joinRoom(userId, roomKey)
  }

  public async joinRoom(userId: number, roomKey: string): Promise<void> {
    const room = await this.rooms.findOne({
      where: { roomKey }
    })
    
    const user = await this.users.findOne({
      where: { id: userId },
      relations: {
        rooms: true
      }
    })

    if (user.rooms.find((e) => e.id === room.id)) {
      throw new NotAcceptableException({
        success: false,
        message: 'User already in room'
      })
    }

    
    user.rooms.push(room)
    console.log(user)
    await this.users.save(user)
  }

  public async findRoomByKey(roomKey: string): Promise<Room | undefined> {
    return await this.rooms.findOne({
      where: { roomKey },
      relations: {
        users: true
      }
    }) ?? undefined
  }
  
  public async leaveRoom(userId: number, roomId: number): Promise<void> {
    const room = await this.rooms.findOne({
      where: { id: roomId }
    })
    const users = room.users.find((e) => e.id === userId)

    if (users === undefined) {
      throw new NotFoundException({
        success: false,
        message: 'user not found to leave'
      })
    }

    room.users = room.users.filter((e) => e.id !== userId)
  }
}