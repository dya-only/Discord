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
import { CreateChannelDto } from './dto/CreateChannelDto'
import { UpdateChannelDto } from './dto/UpdateChannelDto'
import { UploadImageDto } from './dto/UploadImageDto'

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

  public async uploadImage(userId: number, uploadImageDto: UploadImageDto, filename: string): Promise<void> {
    await this.chats.insert({
      message: `<<<[!img ${filename}`,   // Image prefix: <<<[!img
      channelId: uploadImageDto.channelId,
      userId
    })
  }

  public async findChat(channelId: number, page: number): Promise<Chat[]> {
    return (await this.chats.find({
      where: { channelId },
      skip: page * 50,
      take: 50,
      order: { id: 'DESC' }
    }))
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


  public async createRoom(userId: number, createRoomDto: CreateRoomDto, filename: string): Promise<void> {
    let roomKey = url(small)
    if ((await this.rooms.findOne({ where: { roomKey } })) !== undefined) roomKey = url(small)  

    await this.rooms.insert({
      name: createRoomDto.name,
      ownerId: userId,
      roomKey,
      image: filename !== undefined ? filename : 'default.png'
    })

    const room = await this.rooms.findOne({
      where: { roomKey }
    })

    await this.joinRoom(userId, roomKey)
    await this.createChannel({
      roomId: room.id,
      name: '일반'
    })
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
    await this.users.save(user)
  }

  public async findRoomByKey(roomKey: string): Promise<Room | undefined> {
    return await this.rooms.findOne({
      where: { roomKey },
      relations: {
        users: true,
        channels: true
      }
    }) ?? undefined
  }
  
  public async leaveRoom(userId: number, roomId: number): Promise<void> {
    const user = await this.users.findOne({
      where: { id: userId },
      relations: {
        rooms: true
      }
    })
    
    user.rooms = user.rooms.filter((e) => e.id !== roomId)
    await this.users.save(user)
  }


  // ---


  public async createChannel(createChannelDto: CreateChannelDto): Promise<void> {
    await this.channels.insert({
      name: createChannelDto.name,
      roomId: createChannelDto.roomId
    })
  }

  public async updateChannel(channelId: number, updateChannelDto: UpdateChannelDto): Promise<void> {
    await this.channels.update(channelId, {
      name: updateChannelDto.name
    })
  }

  public async deleteChannel(channelId: number): Promise<void> {
    await this.channels.delete(channelId)
  }
}