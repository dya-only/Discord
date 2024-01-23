import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UsersService } from 'src/users/users.service'

@WebSocketGateway({ cors: true })
export class EventsGateway {
  constructor (
    private usersService: UsersService
  ) {}

  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinChannel')
  handleJoinRoom(@MessageBody() joinKey: string, @ConnectedSocket() client: Socket) {
    console.log(`${joinKey} channel joined.`)
    client.join(joinKey)
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() message: { joinKey: string, msg: string, userId: number }): Promise<void> {
    console.log(`channel ${message.joinKey}: ${message.msg}`)
    this.server.to(message.joinKey).emit('sendMessage', {
      joinKey: message.joinKey,
      msg: message.msg,
      user: await this.usersService.findUser(message.userId) 
    })
  }
}