import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
const log = console.log

@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomKey: string, @ConnectedSocket() client: Socket) {
    log(`${roomKey} joined.`)
    client.join(roomKey)
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: { roomKey: string, message: string }): void {
    log(`${message.roomKey}'s new message: ${message.message}`)
    this.server.to(message.roomKey).emit('sendMessage', message)
  }
}