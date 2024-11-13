import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Request, Response } from "express";
import { Public } from "src/security/auth/auth.decorator";
import { UserSignInDto } from "./dto/signIn-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@ApiBearerAuth()
@Controller("users")
@ApiTags("User Management")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post("signUp")
  async signUp(@Body() body: CreateUserDto, @Res() response: Response) {
    return this.usersService.signUp(body, response);
  }

  @Public()
  @Post("signIn")
  async signIn(@Body() body: UserSignInDto, @Res() response: Response) {
    return this.usersService.signIn(body, response);
  }

  @Post("update")
  async updateUser(
    @Body() body: UpdateUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    return this.usersService.updateUser(body, request, response);
  }

  @Get("view")
  async viewUser(@Req() request: Request, @Res() response: Response) {
    return this.usersService.viewUser(request, response);
  }
}
