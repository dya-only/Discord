import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from 'src/auth/auth.guard'
import { EventsService } from './events.service'
import { CreateChatDto } from './dto/CreateChatDto'
import { UpdateChatDto } from './dto/UpdateChatDto'

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
}