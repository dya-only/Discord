import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CreateChatDto {
  @IsString()
  @ApiProperty()
  public readonly roomKey: string

  @MaxLength(1000)
  @IsString()
  @ApiProperty()
  public readonly message: string
}