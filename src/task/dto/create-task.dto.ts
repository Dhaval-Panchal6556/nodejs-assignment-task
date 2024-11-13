import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  assignedTo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  developerId: string;
}
