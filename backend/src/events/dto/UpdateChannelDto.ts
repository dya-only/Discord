import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class UpdateChannelDto {
  @MaxLength(1000)
  @IsString()
  @ApiProperty()
  public readonly name: string
}