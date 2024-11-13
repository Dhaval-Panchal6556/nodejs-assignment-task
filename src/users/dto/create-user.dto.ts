import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  IsEnum,
} from "class-validator";
import { USER_TYPES } from "src/common/constants/enum.constant";
import {
  INVALID_EMAIL_FORMAT,
  INVALID_PASSWORD_FORMAT,
} from "src/common/constants/response.constant";
import { EmailRegex, PasswordRegex } from "src/common/regex/common.regex";
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ default: "+91" })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    required: true,
    description: "Email",
  })
  @Matches(EmailRegex, {
    message: INVALID_EMAIL_FORMAT,
  })
  @Transform((email) => email.value.toLowerCase())
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    description: "Password",
  })
  @Matches(PasswordRegex, {
    message: INVALID_PASSWORD_FORMAT,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: "User Type Enum",
    required: true,
    default: USER_TYPES.USER,
  })
  @IsEnum(USER_TYPES, {
    message: "",
  })
  role: string;
}
