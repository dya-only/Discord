import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString, Length, MaxLength } from "class-validator"

export class UpdateUserDto {
  @MaxLength(5000)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string

  @Length(0, 20)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly nickname: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly avatar: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly status: 'online' | 'offline'
}
