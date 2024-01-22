import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsString, MaxLength } from 'class-validator'

export class CreateChannelDto {
  @IsInt()
  @IsPositive()
  @ApiProperty()
  public readonly roomId: number

  @MaxLength(10)
  @IsString()
  @ApiProperty()
  public readonly name: string
}