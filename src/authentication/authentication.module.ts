import { Module, OnModuleInit } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationController } from "./authentication.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { JwtService } from "@nestjs/jwt";
import { Users, UsersSchema } from "src/users/schemas/user.schema";
import { CommonService } from "src/common/services/common.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LoggerService, CommonService, JwtService],
})
export class AuthenticationModule implements OnModuleInit {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async onModuleInit(): Promise<void> {
    await this.authenticationService.createAdminInitialUser();
  }
}
