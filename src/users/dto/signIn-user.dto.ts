import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import {
  INVALID_EMAIL_FORMAT,
  INVALID_PASSWORD_FORMAT,
} from "src/common/constants/response.constant";
import { EmailRegex, PasswordRegex } from "src/common/regex/common.regex";

export class UserSignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(EmailRegex, {
    message: INVALID_EMAIL_FORMAT,
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(PasswordRegex, {
    message: INVALID_PASSWORD_FORMAT,
  })
  password: string;
}
