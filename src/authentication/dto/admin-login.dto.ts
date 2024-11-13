import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { Transform } from "class-transformer";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "src/common/constants";
import { EmailRegex, PasswordRegex } from "src/common/regex/common.regex";
import {
  INVALID_EMAIL_FORMAT,
  INVALID_PASSWORD_FORMAT,
} from "src/common/constants/response.constant";

export class AdminLoginDto {
  @ApiProperty({ example: ADMIN_EMAIL })
  @IsNotEmpty()
  @IsString()
  @Matches(EmailRegex, {
    message: INVALID_EMAIL_FORMAT,
  })
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: ADMIN_PASSWORD })
  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, {
    message: INVALID_PASSWORD_FORMAT,
  })
  password: string;
}
