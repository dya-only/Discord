import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginByPasswordDto {
  @IsString()
  @ApiProperty()
  public readonly login: string

  @IsString()
  @ApiProperty()
  public readonly password: string
}