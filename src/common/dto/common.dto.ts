import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  ValidateIf,
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { EmailRegex, PasswordRegex } from "../regex/common.regex";
import {
  INVALID_EMAIL_FORMAT,
  INVALID_PASSWORD_FORMAT,
} from "../constants/response.constant";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class DateRangeDto {
  @ApiProperty({ type: Date, format: "date" })
  @ValidateIf((r) => r.endDate)
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: Date, format: "date" })
  @ValidateIf((r) => r.startDate)
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}

export class UserIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _id: string;
}

export class PaginationDto {
  @ApiProperty({ required: false, description: "Search", default: "" })
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({ required: false, description: "start", default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  start: number;

  @ApiProperty({ required: false, description: "length", default: 10 })
  @IsNumber()
  @IsOptional()
  length: number;

  @ApiProperty({ name: "sort", required: false, example: "column name" })
  @IsString()
  @IsOptional()
  sort: string;

  @ApiProperty({ name: "dir", required: false, example: "asc or desc" })
  @IsString()
  @IsOptional()
  dir: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  @MaxLength(32)
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, {
    message: INVALID_PASSWORD_FORMAT,
  })
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(EmailRegex, {
    message: INVALID_EMAIL_FORMAT,
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
