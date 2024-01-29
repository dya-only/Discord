import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { EventsService } from './events.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from './entities/chat.entity'
import { Room } from './entities/room.entity'
import { EventsController } from './events.controller';
import { Channel } from './entities/channel.entity'
import { User } from 'src/users/entities/user.entity'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, Room, Channel]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'dist/uploads/events'),
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}${file.originalname}`)
        },
      }),
    })
  ],
  controllers: [EventsController],
  providers: [EventsGateway, EventsService],
  exports: [EventsGateway]
})
export class EventsModule { }
