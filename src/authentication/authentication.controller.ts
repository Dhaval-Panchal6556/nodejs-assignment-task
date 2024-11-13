import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { ForgotPasswordDto, ResetPasswordDto } from "src/common/dto/common.dto";
import { Public } from "src/security/auth/auth.decorator";

@ApiTags("Admin")
@Controller("admin")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post("login")
  login(@Body() body: AdminLoginDto, @Res() res: Response) {
    return this.authenticationService.adminLogin(body, res);
  }

  @Public()
  @Post("forgotPassword")
  forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    return this.authenticationService.forgotPassword(body, res);
  }

  @Public()
  @Post("resetPassword")
  resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    return this.authenticationService.resetPassword(body, res);
  }
}
