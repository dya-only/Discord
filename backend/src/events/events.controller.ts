import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { EventsService } from './events.service'
import { CreateChatDto } from './dto/CreateChatDto'

@Controller('events')
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

  @Get(':roomKey')
  public async findChat(@Param('roomKey') roomKey: string) {
    return {
      success: true,
      body: await this.eventsService.findChat(roomKey)
    }
  }
}