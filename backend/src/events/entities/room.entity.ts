import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsPositive, IsString, MaxLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Channel } from './channel.entity'
import { User } from 'src/users/entities/user.entity'

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

  @Column()
  @IsString()
  @MaxLength(10)
  @ApiProperty()
  public readonly name: string

  @Column({
    name: 'owner_id',
    type: 'int',
    unsigned: true
  })
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly ownerId: number

  @Column({
    unique: true
  })
  @IsString()
  @ApiProperty()
  public readonly key: string

  @Column()
  @IsString()
  @ApiProperty()
  public readonly image: string

  @CreateDateColumn({
    name: 'createdat',
    type: 'timestamp'
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  @OneToMany(() => Channel, (c) => c.room, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @ApiProperty()
  public readonly channels: Channel[]

  @OneToMany(() => User, (u) => u.room, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @ApiProperty()
  public readonly users: User[]
}