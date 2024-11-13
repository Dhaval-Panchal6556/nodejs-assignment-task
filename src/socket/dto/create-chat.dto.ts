import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class ChatListDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class ChatHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit: number;
}

export class VendorLocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vendorId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lat: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lng: string;
}

export class VendorTrackLocationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  vendorId: string;
}
