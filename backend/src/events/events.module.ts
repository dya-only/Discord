import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { EventsService } from './events.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from './entities/chat.entity'
import { Room } from './entities/room.entity'
import { EventsController } from './events.controller';
import { Channel } from './entities/channel.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Room, Channel])],
  controllers: [EventsController],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway]
})
export class EventsModule {}