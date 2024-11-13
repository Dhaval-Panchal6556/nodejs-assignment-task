import { Injectable } from "@nestjs/common";
import { Projects, ProjectDocument } from "./schemas/project-management.schema";
import mongoose, { Model } from "mongoose";
import { Users, UsersDocument } from "src/users/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { CustomError, TypeExceptions } from "src/common/helpers/exceptions";
import { CreateProjectManagementDto } from "./dto/create-project-management.dto";
import { Response } from "express";
import {
  PROJECT_MSG,
  USER_DOES_NOT_FOUND,
} from "src/common/constants/response.constant";
import { statusOk } from "src/common/constants/response.status.constant";
import { successResponse } from "src/common/response/success.response";
import { UpdateProjectManagementDto } from "./dto/update-project-management.dto";
import { PaginationDto } from "src/common/dto/common.dto";

@Injectable()
export class ProjectManagementService {
  constructor(
    @InjectModel(Projects.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    private myLogger: LoggerService
  ) {
    // Due to transient scope, UsersService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext(ProjectManagementService.name);
  }

  async findUserById(id: string) {
    return await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
  }
  /**
   * Creates a new project for the authenticated user.
   *
   * @param body - Project data (e.g., name, description).
   * @param request - The request object containing the user's ID.
   * @param response - The response object to return the result.
   */
  async createProject(
    body: CreateProjectManagementDto,
    request,
    response: Response
  ) {
    try {
      const reqId = request.user._id;

      const validId = await this.findUserById(request.user._id);

      if (!validId) {
        throw TypeExceptions.NotFoundCommonFunction(USER_DOES_NOT_FOUND);
      }

      body.userId = reqId;

      await this.projectModel.create(body);

      /// success response
      return response
        .status(statusOk)
        .json(successResponse(statusOk, PROJECT_MSG.PROJECT_ADDED_SUCC, {}));
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Updates an existing project for the authenticated user.
   *
   * @param id - The project ID to be updated.
   * @param body - The data to update the project with.
   * @param request - The request object containing the authenticated user's ID.
   * @param response - The response object to return the result.
   */
  async updateProject(
    id: string,
    body: UpdateProjectManagementDto,
    request,
    response: Response
  ) {
    try {
      const reqId = request.user._id;

      const validId = await this.findUserById(request.user._id);

      if (!validId) {
        throw TypeExceptions.NotFoundCommonFunction(USER_DOES_NOT_FOUND);
      }

      const findProject = await this.projectModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!findProject) {
        throw TypeExceptions.NotFoundCommonFunction(
          PROJECT_MSG.PROJECT_NOT_FOUND
        );
      }

      if (findProject.userId.toString() === reqId.toString()) {
        await this.projectModel.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(id),
          },
          {
            $set: {
              ...body,
            },
          }
        );
      } else {
        throw TypeExceptions.BadReqCommonFunction(
          PROJECT_MSG.PROJECT_IS_NOT_LINKED
        );
      }

      /// success response
      return response
        .status(statusOk)
        .json(successResponse(statusOk, PROJECT_MSG.PROJECT_UPDATED_SUCC, {}));
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Retrieves and views the details of a specific project by ID.
   *
   * @param id - The ID of the project to retrieve.
   * @param response - The response object to return the result.
   */
  async viewProject(id: string, response) {
    try {
      const findProject = await this.projectModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!findProject) {
        throw TypeExceptions.NotFoundCommonFunction(
          PROJECT_MSG.PROJECT_NOT_FOUND
        );
      }

      /// success response
      return response.status(statusOk).json(
        successResponse(statusOk, PROJECT_MSG.PROJECT_VIEW_SUCC, {
          findProject,
        })
      );
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Lists all projects for the authenticated user with pagination, search, and sorting.
   *
   * @param body - Pagination, sorting, and search parameters.
   * @param request - The request object containing the authenticated user's ID.
   * @param res - The response object to return the result.
   */
  async listProject(body: PaginationDto, request, res: Response) {
    try {
      const reqId = request.user._id;

      const validId = await this.findUserById(request.user._id);

      if (!validId) {
        throw TypeExceptions.NotFoundCommonFunction(USER_DOES_NOT_FOUND);
      }

      const aggregationQuery = [];

      aggregationQuery.push({
        $match: {
          userId: new mongoose.Types.ObjectId(reqId),
        },
      });

      aggregationQuery.push({
        $project: {
          title: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
          isActive: 1,
          convertedForSort: {
            $cond: [
              {
                $eq: [
                  {
                    $type: `$${body.sort ? body.sort : "createdAt"}`,
                  },
                  "string",
                ],
              },
              {
                $toLower: `$${body.sort ? body.sort : "createdAt"}`,
              },
              `$${body.sort ? body.sort : "createdAt"}`,
            ],
          },
        },
      });

      // Sort stage based on sortBy and sort order
      if (body.search) {
        const searchText = body.search
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(searchText, "i");
        aggregationQuery.push({
          $match: {
            $or: [
              {
                name: {
                  $regex: regex,
                },
              },
            ],
          },
        });
      }

      const sort = {
        convertedForSort: body.dir && body.dir == "asc" ? 1 : -1,
      };

      aggregationQuery.push({
        $sort: sort,
      });

      // Facet stage to separate result documents and count
      aggregationQuery.push({
        $facet: {
          list: [
            {
              $skip: Number(body.start) || 0,
            },
            {
              $limit: Number(body.length) || 10,
            },
          ],
          total_records: [{ $count: "count" }],
        },
      });

      // Execute the aggregate query
      const projectList = await this.projectModel.aggregate(aggregationQuery);

      // Format the total_records field
      if (projectList) {
        projectList[0].total_records =
          projectList[0].total_records.length > 0
            ? projectList[0].total_records[0].count
            : 0;
      }

      // Return the result
      if (projectList?.length) {
        // Return successful response resetToken
        return res.status(statusOk).json(
          successResponse(statusOk, PROJECT_MSG.PROJECT_LIST_SUCC, {
            ...projectList[0],
          })
        );
      } else {
        return {};
      }
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  /**
   * Deletes a specific project by ID.
   *
   * @param id - The ID of the project to be deleted.
   * @param response - The response object to return the result.
   */
  async deleteProject(id: string, response) {
    try {
      const findProject = await this.projectModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!findProject) {
        throw TypeExceptions.NotFoundCommonFunction(
          PROJECT_MSG.PROJECT_NOT_FOUND
        );
      }

      await this.projectModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
      });

      /// success response
      return response
        .status(statusOk)
        .json(successResponse(statusOk, PROJECT_MSG.PROJECT_DELETED_SUCC, {}));
    } catch (error) {
      // If any error occurs, throw a custom "Unknown Error" with the error message and status
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }
}
