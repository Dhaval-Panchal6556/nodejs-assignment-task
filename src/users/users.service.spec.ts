import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getModelToken } from "@nestjs/mongoose";
import { Users } from "./schemas/user.schema";
import { UserModel } from "../common/test/schema.model";
import { LoggerService } from "../common/logger/logger.service";
import { ConfigService } from "@nestjs/config";
import { HttpStatus } from "@nestjs/common";
import { LoginDto } from "src/common/dto/common.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

describe("UsersService", () => {
  let service: UsersService, userModel: UserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        LoggerService,
        ConfigService,
        {
          provide: getModelToken(Users.name),
          useClass: UserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<UserModel>(getModelToken(Users.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe("create user api", () => {
    const body: CreateUserDto = {
      firstName: "Admin",
      lastName: "test",
      email: "test@yopmail.com",
      gender: "male",
      password: "123456",
      isActive: true,
    };

    it("should check create user api", async () => {
      // Mock the addModel.create method to return a ad entity
      jest.spyOn(userModel, "findOne").mockResolvedValue(null as never);
      jest.spyOn(userModel, "getUserByEmail").mockResolvedValue(null as never);
      jest.spyOn(userModel, "create").mockResolvedValue(body as never);

      const result = await service.create(body);
      // Expectations
      expect(userModel.create).toHaveBeenCalled();
      expect(result).toEqual(body);
    });

    it("should throw email already exist error", async () => {
      try {
        // Mock the addModel.create method to return a ad entity
        jest
          .spyOn(userModel, "getUserByEmail")
          .mockResolvedValue(body as never);
        await service.create(body);
        // Expectations
        expect(userModel.getUserByEmail).toHaveBeenCalled();
      } catch (error) {
        expect(error.response).toEqual({
          statusCode: HttpStatus.CONFLICT,
          message: "User already exist with this email",
          error: "Already Exists",
        });
      }
    });
  });

  describe("user find all api", () => {
    it("should check user find all api", async () => {
      // Mock the addModel.create method to return a ad entity
      jest.spyOn(userModel, "find").mockResolvedValue([
        {
          _id: "65b34473ab4f93d0ccb9d04f",
          firstName: "Admin",
          lastName: "test",
          email: "test@yopmail.com",
          gender: "male",
          password: "123456",
          isActive: true,
        },
        {
          id: 2,
          firstName: "Admin",
          lastName: "test",
          email: "test@yopmail.com",
          gender: "male",
          password: "123456",
          isActive: true,
        },
      ] as never);

      const result = await service.findAll();
      // Expectations
      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual([
        {
          _id: "65b34473ab4f93d0ccb9d04f",
          firstName: "Admin",
          lastName: "test",
          email: "test@yopmail.com",
          gender: "male",
          password: "123456",
          isActive: true,
        },
        {
          id: 2,
          firstName: "Admin",
          lastName: "test",
          email: "test@yopmail.com",
          gender: "male",
          password: "123456",
          isActive: true,
        },
      ]);
    });
  });

  describe("user details api", () => {
    it("should check user details api", async () => {
      // Mock the addModel.create method to return a ad entity
      jest.spyOn(userModel, "findOne").mockResolvedValue({
        _id: "65b34473ab4f93d0ccb9d04f",
        firstName: "Admin",
        lastName: "test",
        email: "test@yopmail.com",
        gender: "male",
        password: "123456",
        isActive: true,
      } as never);

      const result = await service.findOne("65b34473ab4f93d0ccb9d04f");
      // Expectations
      expect(userModel.findOne).toHaveBeenCalled();
      expect(result).toEqual({
        _id: "65b34473ab4f93d0ccb9d04f",
        firstName: "Admin",
        lastName: "test",
        email: "test@yopmail.com",
        gender: "male",
        password: "123456",
        isActive: true,
      });
    });
  });

  describe("update user api", () => {
    it("should check update user api", async () => {
      const body: UpdateUserDto = {
        firstName: "Admin",
        lastName: "test",
        email: "test@yopmail.com",
        gender: "male",
        password: "123456",
        isActive: true,
      };
      // Mock the addModel.create method to return a ad entity
      jest.spyOn(userModel, "findOneAndUpdate").mockResolvedValue({
        _id: "65b34473ab4f93d0ccb9d04f",
        firstName: "Admin",
        lastName: "test",
        email: "test@yopmail.com",
        gender: "male",
        password: "123456",
        isActive: true,
      } as never);

      const result = await service.update("65b34473ab4f93d0ccb9d04f", body);
      // Expectations
      expect(userModel.findOneAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        _id: "65b34473ab4f93d0ccb9d04f",
        firstName: "Admin",
        lastName: "test",
        email: "test@yopmail.com",
        gender: "male",
        password: "123456",
        isActive: true,
      });
    });
  });

  describe("delete user api", () => {
    it("should check delete user api", async () => {
      // Mock the addModel.create method to return a ad entity
      jest.spyOn(userModel, "deleteOne").mockResolvedValue({
        _id: "65b34473ab4f93d0ccb9d04f",
        firstName: "Admin",
        lastName: "test",
        email: "test@yopmail.com",
        gender: "male",
        password: "123456",
        isActive: true,
      } as never);

      const result = await service.remove("65b34473ab4f93d0ccb9d04f");
      // Expectations
      expect(userModel.deleteOne).toHaveBeenCalled();
      expect(result).toEqual({
        _id: "65b34473ab4f93d0ccb9d04f",
        firstName: "Admin",
        lastName: "test",
        email: "test@yopmail.com",
        gender: "male",
        password: "123456",
        isActive: true,
      });
    });
  });

  describe("login user api", () => {
    const body: LoginDto = {
      email: "test@yopmail.com",
      password: "123456",
    };

    it("should throw inactive user error", async () => {
      try {
        // Mock the addModel.create method to return a ad entity
        jest.spyOn(userModel, "findOne").mockResolvedValue({
          _id: "65b34473ab4f93d0ccb9d04f",
          firstName: "Admin",
          lastName: "test",
          email: "test@yopmail.com",
          gender: "male",
          password: "123456",
          isActive: false,
        } as never);

        await service.login(body);
        // Expectations
        expect(userModel.findOne).toHaveBeenCalled();
      } catch (error) {
        expect(error.response).toEqual({
          message: "Account not active!",
          error: "AccountNotActive",
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
    });

    it("should throw user not found error", async () => {
      try {
        // Mock the addModel.create method to return a ad entity
        jest.spyOn(userModel, "findOne").mockResolvedValue(null as never);

        await service.login(body);
        // Expectations
        expect(userModel.findOne).toHaveBeenCalled();
      } catch (error) {
        expect(error.response).toEqual({
          message: "Account does not exist!",
          error: "AccountNotExist",
          statusCode: HttpStatus.FORBIDDEN,
        });
      }
    });
  });
});
