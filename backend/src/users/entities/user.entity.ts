import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsHexadecimal, IsInt, IsOptional, IsPositive, IsString, Length, MaxLength } from 'class-validator'
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Room } from 'src/events/entities/room.entity'

@Entity({
  name: 'users'
})
export class User {
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
  @Length(3, 50)
  @IsString()
  @ApiProperty()
  public readonly email: string

  @Column({
    unique: true
  })
  @Length(3, 20)
  @IsString()
  @ApiProperty()
  public readonly login: string

  @Column()
  @Length(1, 20)
  @IsString()
  @ApiProperty()
  public readonly nickname: string

  @Column({
    select: false,
  })
  @IsString()
  @IsHexadecimal()
  @Length(128, 128)
  @ApiProperty()
  public readonly password: string

  @Column({
    default: ''
  })
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string

  @Column()
  @IsString()
  @ApiProperty()
  public readonly avatar: string

  @Column()
  @IsString()
  @ApiProperty()
  public readonly status: 'online' | 'offline'

  @Column({
    select: false
  })
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  public readonly salt: string

  @CreateDateColumn({
    name: 'createdat',
    type: 'timestamp'
  })
  @IsDate()
  @ApiProperty()
  public readonly createdAt: Date

  @ManyToMany(() => Room, (r) => (r).users)
  @JoinTable()
  @ApiProperty()
  rooms: Room[]
}
