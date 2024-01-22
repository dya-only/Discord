import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinChannel')
  handleJoinRoom(@MessageBody() roomKey: string, @ConnectedSocket() client: Socket) {
    client.join(roomKey)
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: { roomKey: string, message: string }): void {
    this.server.to(message.roomKey).emit('sendMessage', message)
  }
}