import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsString, MaxLength } from 'class-validator'

export class CreateChatDto {
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly channelId: number

  @MaxLength(1000)
  @IsString()
  @ApiProperty()
  public readonly message: string
}