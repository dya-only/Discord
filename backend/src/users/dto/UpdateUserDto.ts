import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserDto {
  @MaxLength(5000)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  public readonly bio?: string

  @IsString()
  @ApiProperty()
  public readonly avatar: string
}