import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { USER_TYPES } from "src/common/constants/enum.constant";

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    description: "User Type Enum",
    required: false,
    default: USER_TYPES.USER,
  })
  @IsOptional()
  @IsEnum(USER_TYPES, {
    message: "",
  })
  role: string;
}
