import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsString, MaxLength } from 'class-validator'

export class CreateRoomDto {
  @IsString()
  @MaxLength(10)
  @ApiProperty()
  public readonly name: string

  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly ownerId: number
}