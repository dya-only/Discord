import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: true })
export class EventsGateway {
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
      userId: message.userId 
    })
  }
}