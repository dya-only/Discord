import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { EventsService } from './events.service'
import { CreateChatDto } from './dto/CreateChatDto'
import { UpdateChatDto } from './dto/UpdateChatDto'
import { CreateRoomDto } from './dto/CreateRoomDto'
import { CreateChannelDto } from './dto/CreateChannelDto'
import { UpdateChannelDto } from './dto/UpdateChannelDto'
import { ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadImageDto } from './dto/UploadImageDto'

@Controller('events')
@ApiTags('Events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor (
    private eventsService: EventsService
  ) {}

  @Post()
  public async createChat(@Res({ passthrough: true }) res: Response, @Body() createChatDto: CreateChatDto) {
    const userId = res.locals.userId
    await this.eventsService.createChat(userId, createChatDto)

    return {
      success: true
    }
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  public async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
    @Body() uploadImageDto: UploadImageDto
  ) {
    const userId = res.locals.userId
    await this.eventsService.uploadImage(userId, uploadImageDto, image.filename)

    return {
      success: true
    }
  }

  @Get('chat/:channelId/:page')
  public async findChat(@Param('channelId') channelId: number, @Param('page') page: number) {
    return {
      success: true,
      body: await this.eventsService.findChat(channelId, page),
      next: page + 1
    }
  }

  @Patch(':chatId')
  public async updateChat(@Res({ passthrough: true }) res: Response, @Param('chatId') chatId: number, @Body() updateChatDto: UpdateChatDto) {
    const userId = res.locals.userId
    await this.eventsService.updateChat(userId, chatId, updateChatDto)

    return {
      success: true
    }
  }

  @Delete(':chatId')
  public async deleteChat(@Res({ passthrough: true }) res: Response, @Param(':chatId') chatId: number) {
    const userId = res.locals.userId
    await this.eventsService.deleteChat(userId, chatId)

    return {
      success: true
    }
  }


  // ---


  @Post('room')
  @UseInterceptors(FileInterceptor('logo'))
  public async createRoom(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false })) logo: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
    @Body() createRoomDto: CreateRoomDto
  ) {
    const userId = res.locals.userId
    await this.eventsService.createRoom(userId, createRoomDto, logo.filename)

    return {
      success: true
    }
  }

  @Get('room/:roomKey')
  public async findRoomByKey(@Param('roomKey') roomKey: string) {
    return {
      success: true,
      body: await this.eventsService.findRoomByKey(roomKey)
    }
  }

  @Get('room/join/:roomKey')
  public async joinRoom(@Res({ passthrough: true }) res: Response, @Param('roomKey') roomKey: string) {
    const userId = res.locals.userId
    await this.eventsService.joinRoom(userId, roomKey)

    return {
      success: true
    }
  }

  @Delete('room/:roomId')
  public async leaveRoom(@Res({ passthrough: true }) res: Response, @Param('roomId') roomId: number) {
    const userId = res.locals.userId
    await this.eventsService.leaveRoom(userId, roomId)

    return {
      success: true
    }
  }


  // ---


  @Post('channel')
  public async createChannel(@Body() createChannelDto: CreateChannelDto) {
    await this.eventsService.createChannel(createChannelDto)

    return {
      success: true
    }
  }

  @Patch('channel/:channelId')
  public async updateChannel(@Param('channelId') channelId: number, @Body() updateChannelDto: UpdateChannelDto) {
    await this.eventsService.updateChannel(channelId, updateChannelDto)

    return {
      success: true
    }
  }

  @Delete('channel/:channelId')
  public async deleteChannel(@Param('channelId') channelId: number) {
    await this.eventsService.deleteChannel(channelId)

    return {
      success: true
    }
  }
}