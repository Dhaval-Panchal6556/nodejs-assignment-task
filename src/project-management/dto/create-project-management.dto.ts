import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import mongoose from "mongoose";

export class CreateProjectManagementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: Date, format: "date" })
  @IsOptional()
  @ValidateIf((r) => r.startDate)
  @IsDateString()
  startDate: Date;

  @ApiProperty({ type: Date, format: "date" })
  @IsOptional()
  @ValidateIf((r) => r.endDate)
  @IsDateString()
  endDate: Date;

  userId: mongoose.Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: string;
}
