import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsPositive, IsString, Length } from 'class-validator'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Chat } from './chat.entity'
import { Room } from './room.entity'

@Entity({
  name: 'channels'
})
export class Channel {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number
  
  @Column()
  @Length(1, 10)
  @IsString()
  @ApiProperty()
  public readonly name: string

  @CreateDateColumn({
    name: 'createdat',
    type: 'timestamp'
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  @Column({
    name: 'room_id',
    type: 'int',
    nullable: false
  })
  @IsPositive()
  @ApiProperty()
  public readonly roomId: number

  @OneToMany(() => Chat, (c) => c.channel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @ApiProperty()
  public readonly chats: Chat[]

  @ManyToOne(() => Room, (r) => r.channels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'roomId',
    referencedColumnName: 'id'
  })
  @ApiProperty()
  public readonly room: Room
}