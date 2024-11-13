import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { LoggerService } from "../../common/logger/logger.service";
import { getModelToken } from "@nestjs/mongoose";
import { Users } from "../../users/schemas/user.schema";
import { UserModel } from "../../common/test/schema.model";
import { UsersService } from "../../users/users.service";
import { ConfigService } from "@nestjs/config";

describe("AuthController", () => {
  let controller: AuthController, service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        LoggerService,
        UsersService,
        ConfigService,
        {
          provide: getModelToken(Users.name),
          useClass: UserModel,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
