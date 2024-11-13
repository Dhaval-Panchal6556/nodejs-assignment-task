import { HttpException, HttpStatus } from "@nestjs/common";

export const AuthExceptions = {
  TokenExpired(): HttpException {
    return new HttpException(
      {
        message: "Token Expired use RefreshToken",
        error: "TokenExpiredError",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidToken(): HttpException {
    return new HttpException(
      {
        message: "Invalid Token",
        error: "InvalidToken",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  ForbiddenException(): HttpException {
    return new HttpException(
      {
        message: "This resource is forbidden from this user",
        error: "UnAuthorizedResourceError",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidUserId(): HttpException {
    return new HttpException(
      {
        message: "Invalid User Id",
        error: "InvalidUserId",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  InvalidPassword(): HttpException {
    return new HttpException(
      {
        message: "Please enter valid password",
        error: "InvalidPassword",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  },

  AccountNotExist(): HttpException {
    return new HttpException(
      {
        message: "Account does not exist!",
        error: "AccountNotExist",
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  },

  AccountNotActive(): HttpException {
    return new HttpException(
      {
        message: "Account not active!",
        error: "AccountNotActive",
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  },
};
