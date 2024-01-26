import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class UploadImageDto {
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly channelId: number
}