import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsInt, IsOptional, IsPositive, IsString, Length, MaxLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Chat } from './chat.entity'

@Entity({
  name: 'rooms'
})
export class Room {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly id: number


  @Column({
    unique: true
  })
  @IsString()
  @ApiProperty()
  public readonly key: string
  
  @Column()
  @Length(1, 10)
  @IsString()
  @ApiProperty()
  public readonly name: string

  @Column()
  @IsString()
  @MaxLength(20)
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string

  @Column()
  @IsString()
  @ApiProperty()
  public readonly avatar: string

  @CreateDateColumn({
    name: 'createdat',
    type: 'timestamp'
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  // @OneToMany(() => Chat, (c) => c.room, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  //   nullable: false
  // })
  // @ApiProperty()
  // public readonly chats: Chat[]
}