import { HttpException, HttpStatus } from "@nestjs/common";

export const TypeExceptions = {
  NotFoundCommonFunction(message: string): HttpException {
    return new HttpException(
      {
        message: message,
        error: "Not Found",
        statusCode: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
    );
  },

  BadReqCommonFunction(message: string): HttpException {
    return new HttpException(
      {
        message: message,
        error: "Bad Request",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  AlreadyExistsCommonFunction(message: string): HttpException {
    return new HttpException(
      {
        message: message,
        error: "Already Exists",
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  },

  InvalidFile(): HttpException {
    return new HttpException(
      {
        message: "Uploaded file is invalid",
        error: "InvalidFile",
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  },

  Unauthorized(message) {
    return new HttpException(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: message,
        data: {},
      },
      HttpStatus.UNAUTHORIZED,
    );
  },

  UnknownError(message) {
    return new HttpException(
      {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: message,
        data: {},
      },
      HttpStatus.BAD_GATEWAY,
    );
  },
};
