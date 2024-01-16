import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length, MaxLength } from "class-validator";

export class UpdateUserDto {
  @MaxLength(5000)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string

  @Length(1, 20)
  @IsString()
  @ApiProperty()
  public readonly nickname: string 

  @IsString()
  @ApiProperty()
  public readonly avatar: string
}