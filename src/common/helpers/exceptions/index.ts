import { HttpException, HttpStatus } from '@nestjs/common';

export * from './auth.exception';
export * from './type.exception';
export * from './connection.exception';

export const CustomError = {
  UnknownError(message, statusCode?): HttpException {
    return new HttpException(
      {
        statusCode: statusCode || HttpStatus.BAD_REQUEST,
        message: message || 'Something went wrong, please try again later!',
        data: {},
      },
      statusCode || HttpStatus.BAD_REQUEST,
    );
  },
};
