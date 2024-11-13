import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Request, Response } from "express";
import { Model } from "mongoose";
import { AuthExceptions, CustomError } from "src/common/helpers/exceptions";
import { Users, UsersDocument } from "src/users/schemas/user.schema";
import {
  MID_USER_ACC_DELETED,
  MID_USER_ACC_INACTIVE,
} from "../constants/response.constant";

@Injectable()
export class userAuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Middleware for authenticating requests using JWT.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next function.
   */
  async use(req: Request, res: Response, next: (error?: unknown) => void) {
    // Check if the request has an Authorization header and if it starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      // Extract the secret key and access token from the Authorization header
      const secretKey = process.env.JWT_TOKEN_SECRET;
      const accessToken = req.headers.authorization.split(" ")[1];

      try {
        // Verify the access token using the JWT service and secret key
        const letData = this.jwtService.verify(accessToken, {
          secret: secretKey,
        });

        // Extract user information from the decoded token
        const loginUserId = letData._id;

        // Find user based on user type, loginUserId, and deviceId
        const findUser = await this.findUserByType(
          letData.type,
          loginUserId,
          req,
        );

        // Check if the user is null (not found)
        if (findUser == null) {
          throw AuthExceptions.InvalidToken();
        }

        // Check if the user's account is deleted
        if (findUser.isDeleted) {
          return res.status(401).json({
            statusCode: 401,
            message: MID_USER_ACC_DELETED,
            data: {},
          });
        }

        // Check if the user's account is not active
        if (!findUser.isActive) {
          return res.status(401).json({
            statusCode: 401,
            message: MID_USER_ACC_INACTIVE,
            data: {},
          });
        }
        // Attach the user information to the request object
        req["user"] = letData;
        next();
      } catch (error) {
        // Handle different types of errors that can occur during token verification
        if (error?.name === "TokenExpiredError") {
          throw AuthExceptions.TokenExpired();
        }
        if (error?.name === "JsonWebTokenError") {
          throw AuthExceptions.InvalidToken();
        }
        if (error) {
          AuthExceptions.ForbiddenException();
        }
        throw CustomError.UnknownError(error?.message, error?.statusCode);
      }
    } else {
      // No valid Authorization header, move to the next middleware
      next();
    }
  }

  /**
   * Finds a user based on their type, login user ID, and device ID.
   * @param {number} type - The user type (1 for admin, 2 for mobile user).
   * @param {number} loginUserId - The ID of the logged-in user.
   * @param {string} deviceId - The device ID associated with the user.
   * @param {Object} req - The request object to determine the model based on the request path.
   * @returns {Promise} - A promise that resolves to the found user or null.
   */
  async findUserByType(type: string, loginUserId: number, req) {
    // Map user type to corresponding model based on request path
    const typeModelMap = {
      admin: req.baseUrl.startsWith("/admin/") && this.userModel,
      user: req.baseUrl.startsWith("/users/") && this.userModel,
    };

    // Get the model based on the user type
    const modelName = typeModelMap[type];

    // If a valid model is found for the type
    if (modelName) {
      // Find the user using the model
      const findUser = await modelName.findOne({
        _id: loginUserId,
      });

      return findUser;
    } else {
      // Invalid user type, return null
      return null;
    }
  }
}
