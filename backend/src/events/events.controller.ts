import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common'
import { EventsService } from './events.service'
import { Response } from 'express'
import { CreateChatDto } from './dto/CreateChatDto'
import { Chat } from './entities/chat.entity'

@Controller('events')
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

  @Get(':roomKey')
  public async findChat(@Param('roomKey') roomKey: string) {
    return {
      success: true,
      body: await this.eventsService.findChat(roomKey)
    }
  }
}