import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  AuthExceptions,
  CustomError,
  TypeExceptions,
} from "src/common/helpers/exceptions";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import * as bcrypt from "bcrypt";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { statusOk } from "src/common/constants/response.status.constant";
import { successResponse } from "src/common/response/success.response";
import { Response } from "express";
import { CommonService } from "src/common/services/common.service";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "src/common/constants";
import { USER_TYPES } from "src/common/constants/enum.constant";
import {
  ADMIN_LOGIN,
  ADMIN_NOT_FOUND,
  ADMIN_USER_ALREADY_LOADED,
  ADMIN_USER_ALREADY_LOADED_SUCC,
  FORGOT_PASS_SUCC,
  RESET_PASS_SUCC,
  RESET_TOKEN_INVALID,
} from "src/common/constants/response.constant";
import { Users, UsersDocument } from "src/users/schemas/user.schema";
import { ForgotPasswordDto, ResetPasswordDto } from "src/common/dto/common.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(Users.name)
    private readonly usersModel: Model<UsersDocument>,
    private readonly loggerService: LoggerService,
    private readonly commonService: CommonService
  ) {}

  /**
   * Creates the initial admin user if not already loaded.
   *
   * This function checks if an admin user with the email `ADMIN_EMAIL` already exists.
   * If not, it hashes the admin password and creates the user in the database.
   *
   * @throws {CustomError.UnknownError} Throws an unknown error if the process fails.
   * @returns {Promise<void>} Logs a message if the admin user already exists or is successfully created.
   */
  async createAdminInitialUser() {
    try {
      // Initial user data to be inserted
      const insertObj = {
        firstName: "Super",
        lastName: "Admin",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: USER_TYPES.ADMIN,
        resetToken: "",
      };

      // Check if initial user is already loaded
      const findAdminResult = await this.findExistingEmail(insertObj.email);

      if (findAdminResult.status) {
        // Initial user already loaded, log a message and return
        return this.loggerService.customLog(ADMIN_USER_ALREADY_LOADED);
      }

      // Hash the password before inserting
      const hash = await this.commonService.bcryptPassword(
        ADMIN_PASSWORD,
        Number(process.env.PASSWORD_SALT)
      );

      // Create the initial user in the database
      insertObj.password = hash;

      await this.usersModel.create(insertObj);

      this.loggerService.log(ADMIN_USER_ALREADY_LOADED_SUCC);
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Handles the admin login process by validating credentials and generating a JWT token.
   * @param {AdminLoginDto} body - The admin login request body containing email and password.
   * @param {Response} res - The HTTP response object to send the result.
   * @returns {Promise<Response>} - A response containing admin details and a JWT token on successful login.
   * @throws {NotFoundException | AuthExceptions.InvalidPassword | CustomError.UnknownError} - Throws an exception if admin is not found, password is invalid, or an unknown error occurs.
   */
  async adminLogin(body: AdminLoginDto, res: Response) {
    try {
      // Check if email format is invalid
      const findAdminResult = await this.findExistingEmail(body.email);

      // Check if admin user not found
      if (findAdminResult && !findAdminResult.status) {
        // Admin not found, throw a not found exception
        throw TypeExceptions.NotFoundCommonFunction(ADMIN_NOT_FOUND);
      }

      // Admin found, validate password
      const findAdmin = findAdminResult.adminDetails;

      // Validate password
      if (!bcrypt.compareSync(body.password, findAdmin.password)) {
        // Password mismatch, throw an invalid ID or password exception
        throw AuthExceptions.InvalidPassword();
      }

      // Removing Password
      delete findAdmin.password;

      // Jwt payload create
      const payload = {
        id: findAdmin._id,
        role: findAdmin.role,
        email: findAdmin.email,
        type: "Admin",
      };

      // Generate JWT token for the admin
      const jwtToken = await this.commonService.generateAuthToken(payload);

      // Return successful response with admin details and JWT token
      return res.status(statusOk).json(
        successResponse(statusOk, ADMIN_LOGIN, {
          firstName: findAdmin.firstName,
          lastName: findAdmin.lastName,
          role: findAdmin.role,
          accessToken: jwtToken,
        })
      );
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Handles the forgot password process for an admin user by generating a reset token and sending a reset password email.
   * @param {ForgotPasswordDto} body - The DTO containing the email of the admin requesting password reset.
   *   - email: The email address of the admin requesting the password reset.
   * @param {Response} res - The response object used to send back the status and result.
   * @returns {Promise<Response>} - Returns a success response with a reset password link or throws an error if the process fails.
   * @throws {TypeExceptions.NotFoundCommonFunction} - If the admin email is not found in the database.
   * @throws {CustomError.UnknownError} - If any other error occurs during the process.
   */
  async forgotPassword(body: ForgotPasswordDto, res: Response) {
    try {
      // Check if email format is invalid
      const findAdminResult = await this.findExistingEmail(body.email);

      // Check if admin doesn't found
      if (!findAdminResult.status) {
        // Admin doesn't found, throw a not found exception
        throw TypeExceptions.NotFoundCommonFunction(ADMIN_NOT_FOUND);
      }

      //this common service or generateRandomString function using random token string create
      const token = await this.commonService.generateRandomString(32);

      await this.usersModel.findOneAndUpdate(
        {
          _id: findAdminResult.adminDetails._id,
        },
        {
          $set: {
            resetToken: token,
            updatedDate: new Date().toISOString(),
          },
        }
      );

      // Return successful response resetToken
      return res.status(statusOk).json(
        successResponse(statusOk, FORGOT_PASS_SUCC, {
          resetUrlLink: `${process.env.ADMIN_URL}reset-password/${token}`,
        })
      );
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Resets the user's password using the provided reset token and new password.
   * @param {ResetPasswordDto} body - The DTO containing the reset token and new password.
   *   - token: The reset token provided to the user for password reset.
   *   - newPassword: The new password that the user wants to set.
   * @param {Response} res - The response object used to send back the status and result.
   * @returns {Promise<Response>} - Returns a success response with a message indicating password reset success or throws an error if the reset fails.
   * @throws {TypeExceptions.UnknownError} - If the reset token is invalid or any other error occurs.
   */
  async resetPassword(body: ResetPasswordDto, res: Response) {
    try {
      // Find the user with the given reset token
      const resetPassword = await this.usersModel.findOne({
        resetToken: body.token,
      });

      if (!resetPassword) {
        // If no admin user is found, throw an error indicating the reset link has expired
        throw TypeExceptions.UnknownError(RESET_TOKEN_INVALID);
      }

      // Hash the new password using bcrypt
      const newPassword = await this.commonService.bcryptPassword(
        body.newPassword,
        Number(process.env.PASSWORD_SALT)
      );

      // Update the user's password and reset token
      await this.usersModel.findOneAndUpdate(
        {
          email: resetPassword.email,
        },
        {
          $set: { password: newPassword, reset_token: "" },
        }
      );

      return res
        .status(statusOk)
        .json(successResponse(statusOk, RESET_PASS_SUCC, {}));
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Finds an active admin by email.
   * @param {string} email - The email address to search for.
   * @returns {Promise<{status: boolean, adminDetails: any | null}>} - Status of the search and admin details if found.
   */
  async findExistingEmail(email: string) {
    // Execute the query to find the admin
    const findAdmin = await this.usersModel.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });
    if (findAdmin) {
      // Admin was found, return success status and admin details
      return {
        status: true,
        adminDetails: findAdmin,
      };
    }

    // Admin was not found, return failure status and null admin details
    return {
      status: false,
      adminDetails: null,
    };
  }
}
