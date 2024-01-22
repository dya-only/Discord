import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CreateRoomDto {
  @IsString()
  @MaxLength(10)
  @ApiProperty()
  public readonly name: string
}