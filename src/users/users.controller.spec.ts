import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { getModelToken } from "@nestjs/mongoose";
import { Users } from "./schemas/user.schema";
import { UserModel } from "../common/test/schema.model";
import { LoggerService } from "../common/logger/logger.service";
import { ConfigService } from "@nestjs/config";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

describe("UsersController", () => {
  let controller: UsersController, service: UsersService, userModel: UserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        LoggerService,
        ConfigService,
        {
          provide: getModelToken(Users.name),
          useClass: UserModel,
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              _id: "65b34473ab4f93d0ccb9d04f",
              firstName: "Jest",
              lastName: "Test",
              gender: "male",
              email: "test@yopmail.com",
              password: "2023-02-02",
              isActive: true,
            }),
            findAll: jest.fn().mockResolvedValue([
              {
                _id: "65b34473ab4f93d0ccb9d04f",
                firstName: "Jest",
                lastName: "Test",
                gender: "male",
                email: "test@yopmail.com",
                password: "2023-02-02",
                isActive: true,
              },
            ]),
            findOne: jest.fn().mockResolvedValue({
              _id: "65b34473ab4f93d0ccb9d04f",
              firstName: "Jest",
              lastName: "Test",
              gender: "male",
              email: "test@yopmail.com",
              password: "2023-02-02",
              isActive: true,
            }),
            update: jest.fn().mockResolvedValue({
              _id: "65b34473ab4f93d0ccb9d04f",
              firstName: "Jest",
              lastName: "Test",
              gender: "male",
              email: "test@yopmail.com",
              password: "2023-02-02",
              isActive: true,
            }),
            remove: jest.fn().mockResolvedValue({
              _id: "65b34473ab4f93d0ccb9d04f",
              firstName: "Jest",
              lastName: "Test",
              gender: "male",
              email: "test@yopmail.com",
              password: "2023-02-02",
              isActive: true,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    userModel = module.get<UserModel>(getModelToken(Users.name));
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(userModel).toBeDefined();
  });

  it("should be check user create api", async () => {
    const body: CreateUserDto = {
      firstName: "Jest",
      lastName: "Test",
      gender: "male",
      email: "test@yopmail.com",
      password: "2023-02-02",
      isActive: true,
    };

    //Compare the actual response with the expected response
    await expect(controller.create(body)).resolves.toEqual({
      _id: "65b34473ab4f93d0ccb9d04f",
      firstName: "Jest",
      lastName: "Test",
      gender: "male",
      email: "test@yopmail.com",
      password: "2023-02-02",
      isActive: true,
    });
  });

  it("should be check user find all api", async () => {
    //Compare the actual response with the expected response
    await expect(controller.findAll()).resolves.toEqual([
      {
        _id: "65b34473ab4f93d0ccb9d04f",
        firstName: "Jest",
        lastName: "Test",
        gender: "male",
        email: "test@yopmail.com",
        password: "2023-02-02",
        isActive: true,
      },
    ]);
  });

  it("should be check find user details api", async () => {
    //Compare the actual response with the expected response
    await expect(
      controller.findOne("65b34473ab4f93d0ccb9d04f"),
    ).resolves.toEqual({
      _id: "65b34473ab4f93d0ccb9d04f",
      firstName: "Jest",
      lastName: "Test",
      gender: "male",
      email: "test@yopmail.com",
      password: "2023-02-02",
      isActive: true,
    });
  });

  it("should be check update user details api", async () => {
    const body: UpdateUserDto = {
      firstName: "Jest",
      lastName: "Test",
      gender: "male",
      email: "test@yopmail.com",
      password: "2023-02-02",
      isActive: true,
    };
    //Compare the actual response with the expected response
    await expect(
      controller.update("65b34473ab4f93d0ccb9d04f", body),
    ).resolves.toEqual({
      _id: "65b34473ab4f93d0ccb9d04f",
      firstName: "Jest",
      lastName: "Test",
      gender: "male",
      email: "test@yopmail.com",
      password: "2023-02-02",
      isActive: true,
    });
  });

  it("should be check delete user details api", async () => {
    //Compare the actual response with the expected response
    await expect(
      controller.remove("65b34473ab4f93d0ccb9d04f"),
    ).resolves.toEqual({
      _id: "65b34473ab4f93d0ccb9d04f",
      firstName: "Jest",
      lastName: "Test",
      gender: "male",
      email: "test@yopmail.com",
      password: "2023-02-02",
      isActive: true,
    });
  });
});
