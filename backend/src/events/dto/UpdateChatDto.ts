import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class UpdateChatDto {
  @IsString()
  @ApiProperty()
  public readonly roomKey: string

  @MaxLength(1000)
  @IsString()
  @ApiProperty()
  public readonly message: string
}