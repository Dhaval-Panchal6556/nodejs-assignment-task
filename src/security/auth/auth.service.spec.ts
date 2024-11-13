import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { LoggerService } from "../../common/logger/logger.service";
import { getModelToken } from "@nestjs/mongoose";
import { Users } from "../../users/schemas/user.schema";
import { UserModel } from "../../common/test/schema.model";
import { UsersService } from "../../users/users.service";
import { ConfigService } from "@nestjs/config";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        LoggerService,
        ConfigService,
        {
          provide: getModelToken(Users.name),
          useClass: UserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
