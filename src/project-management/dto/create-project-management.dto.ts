import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import mongoose from "mongoose";

export class CreateProjectManagementDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
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
  @IsOptional()
  @IsString()
  status: string;
}
