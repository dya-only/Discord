import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsPositive, IsString, MaxLength } from 'class-validator'
import { User } from 'src/users/entities/user.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Room } from './room.entity'

@Entity({
  name: 'chat'
})
export class Chat {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number

  @Column()
  @MaxLength(1000)
  @IsString()
  @ApiProperty()
  public readonly message: string

  @CreateDateColumn({
    name: 'createdat',
    type: 'timestamp'
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  @Column({
    name: 'userId',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly userId: number

  @Column({
    name: 'roomKey',
    type: 'varchar',
    nullable: false
  })
  public readonly roomKey: string

  @ManyToOne(() => User, (u) => u.chats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id'
  })
  @ApiProperty()
  public readonly user: User

  // @ManyToOne(() => Room, (r) => r.chats, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  //   nullable: false
  // })
  // @JoinColumn({
  //   name: 'roomKey',
  //   referencedColumnName: 'key'
  // })
  // @ApiProperty()
  // public readonly room: Room
}