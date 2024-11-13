import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import {
  AuthExceptions,
  CustomError,
  TypeExceptions,
} from "../common/helpers/exceptions";
import { LoggerService } from "../common/logger/logger.service";
import { Users, UsersDocument } from "../users/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  ACCOUNT_DISABLED,
  EMAIL_ALREADY_EXIST,
  USER_DOES_NOT_FOUND,
  USER_MSG,
} from "src/common/constants/response.constant";
import { CommonService } from "src/common/services/common.service";
import { USER_TYPES } from "src/common/constants/enum.constant";
import { Response } from "express";
import { statusOk } from "src/common/constants/response.status.constant";
import { successResponse } from "src/common/response/success.response";
import { UserSignInDto } from "./dto/signIn-user.dto";
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    private myLogger: LoggerService,
    private commonService: CommonService,
  ) {
    // Due to transient scope, UsersService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext(UsersService.name);
  }

  /**
   * Finds a user by their ID.
   * @param id - The unique identifier (ID) of the user to be retrieved.
   * It should be a string representing a valid MongoDB ObjectId.
   * @returns The user document matching the provided ID, or null if no user is found.
   */
  async findUserById(id: string) {
    return await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
  }

  /**
   * Finds a user by their email address.
   * @param email - The email address of the user to be retrieved.
   * The email is converted to lowercase before querying to ensure case-insensitive matching.
   * @returns The user document matching the provided email address, or null if no user is found or the user is deleted.
   */
  async findUserByEMail(email: string) {
    return await this.userModel.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    });
  }

  /**
   * Handles the user registration process (sign up).
   * @param body - The data used for creating a new user (typically includes first name, last name, email, password, etc.).
   * @param response - The HTTP response object used to send a response back to the client.
   * @returns A success response containing the user's details and JWT access token.
   * @throws TypeExceptions.AlreadyExistsCommonFunction - If the email is already registered.
   * @throws CustomError.UnknownError - If an unknown error occurs during the sign-up process.
   */
  async signUp(body: CreateUserDto, response: Response) {
    try {
      /// check if email is already registered
      const existingEmail = await this.findUserByEMail(body.email);

      /// throw an exception when email address is already exist
      if (existingEmail) {
        throw TypeExceptions.AlreadyExistsCommonFunction(EMAIL_ALREADY_EXIST);
      }

      /// hashing the password
      const hash = await this.commonService.bcryptPassword(
        body.password,
        Number(process.env.PASSWORD_SALT),
      );

      /// assigning encrypted password to body
      body.password = hash;

      const createUser = await this.userModel.create(body);

      // Jwt payload create
      const payload = {
        id: createUser._id,
        role: USER_TYPES.USER,
        email: createUser.email,
        type: body.role,
      };

      // Generate JWT token for the admin
      const jwtToken = await this.commonService.generateAuthToken(payload);

      /// success response
      return response.status(statusOk).json(
        successResponse(statusOk, USER_MSG.USER_SIGN_UP_SUCC, {
          firstName: createUser.firstName,
          lastName: createUser.lastName,
          email: createUser.email,
          accessToken: jwtToken,
        }),
      );
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Handles the user sign-in process.
   * @param body - The data sent by the client, which includes the email and password.
   * @param response - The HTTP response object used to send the response back to the client.
   * @returns A success response containing the user's details and JWT access token.
   * @throws TypeExceptions.NotFoundCommonFunction - If the user with the given email doesn't exist.
   * @throws TypeExceptions.Unauthorized - If the user account is disabled (inactive).
   * @throws AuthExceptions.InvalidPassword - If the provided password does not match the stored hashed password.
   * @throws CustomError.UnknownError - If an unexpected error occurs during the sign-in process.
   */
  async signIn(body: UserSignInDto, response: Response) {
    try {
      const findUser = await this.findUserByEMail(body.email);

      if (!findUser) {
        throw TypeExceptions.NotFoundCommonFunction(USER_DOES_NOT_FOUND);
      }

      // do check if the user is active or not
      if (!findUser.isActive) {
        throw TypeExceptions.Unauthorized(ACCOUNT_DISABLED);
      }

      if (body.password) {
        // Validate password
        if (!bcrypt.compareSync(body.password, findUser.password)) {
          // Password mismatch, throw an invalid ID or password exception
          throw AuthExceptions.InvalidPassword();
        }
      }

      // Jwt payload create
      const payload = {
        id: findUser._id,
        role: USER_TYPES.USER,
        email: findUser.email,
        type: "user",
      };

      // Generate JWT token for the admin
      const jwtToken = await this.commonService.generateAuthToken(payload);

      /// success response
      return response.status(statusOk).json(
        successResponse(statusOk, USER_MSG.USER_SIGN_IN_SUCC, {
          firstName: findUser.firstName,
          lastName: findUser.lastName,
          role: findUser.role,
          email: findUser.email,
          accessToken: jwtToken,
        }),
      );
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Updates user information based on the provided data.
   * @param body - The data to update the user's details (e.g., name, email, etc.).
   * @param request - The HTTP request object, used to access the authenticated user's ID.
   * @param response - The HTTP response object to send back the response to the client.
   * @returns A success response if the user is updated successfully.
   *
   * @throws TypeExceptions.NotFoundCommonFunction - If the user is not found.
   * @throws CustomError.UnknownError - If any unexpected error occurs during the update.
   */
  async updateUser(body: UpdateUserDto, request, response: Response) {
    try {
      const reqId = request.user._id;

      const validId = await this.findUserById(request.user._id);

      if (!validId) {
        throw TypeExceptions.NotFoundCommonFunction(USER_DOES_NOT_FOUND);
      }

      await this.userModel.findOneAndUpdate(
        {
          _id: reqId,
        },
        {
          $set: {
            ...body,
          },
        },
      );

      /// success response
      return response
        .status(statusOk)
        .json(successResponse(statusOk, USER_MSG.USER_UPDATED_SUCC, {}));
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Retrieves and returns the authenticated user's details (excluding sensitive data).
   * @param request - The HTTP request object, used to access the authenticated user's ID.
   * @param response - The HTTP response object to send back the response to the client.
   * @returns The user's details, excluding sensitive fields like password and deletion status.
   *
   * @throws TypeExceptions.NotFoundCommonFunction - If the user is not found.
   * @throws CustomError.UnknownError - If an unexpected error occurs during the user retrieval.
   */
  async viewUser(request, response: Response) {
    try {
      const reqId = request.user._id;

      const validId = await this.findUserById(request.user._id);

      if (!validId) {
        throw TypeExceptions.NotFoundCommonFunction(USER_DOES_NOT_FOUND);
      }

      const findUser = await this.userModel
        .findOne({
          _id: reqId,
        })
        .lean();

      delete findUser.password;
      delete findUser.isDeleted;

      /// success response
      return response
        .status(statusOk)
        .json(
          successResponse(statusOk, USER_MSG.USER_GET_SUCC, { ...findUser }),
        );
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }
}
