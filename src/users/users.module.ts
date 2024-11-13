import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { Users, UsersSchema } from "./schemas/user.schema";
import { LoggerModule } from "src/common/logger/logger.module";
import { CommonService } from "src/common/services/common.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, CommonService, JwtService],
})
export class UsersModule {}
