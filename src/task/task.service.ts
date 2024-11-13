import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Tasks, TasksDocument } from "./schemas/task.schema";
import mongoose, { Model } from "mongoose";
import { CustomError, TypeExceptions } from "src/common/helpers/exceptions";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskListPaginationDto } from "./dto/task-list.dto";
import { UpdateTaskDetailsDto, UpdateTaskDto } from "./dto/update-task.dto";
import { DeleteTaskDto } from "./dto/delete-task.dto";
import { statusOk } from "src/common/constants/response.status.constant";
import { TASK_MSG } from "src/common/constants/response.constant";
import { Response } from "express";
import { successResponse } from "src/common/response/success.response";

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Tasks.name)
    private readonly taskModel: Model<TasksDocument>
  ) {}

  async createTask(body: CreateTaskDto, res: Response) {
    try {
      const insertObj = {
        ...body,
        assignedTo: body.assignedTo
          ? new mongoose.Types.ObjectId(body.assignedTo)
          : "",
        developerId: new mongoose.Types.ObjectId(body.developerId),
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      await this.taskModel.create(insertObj);

      return res
        .status(statusOk)
        .json(successResponse(statusOk, TASK_MSG.TASK_ADDED_SUCC, {}));
    } catch (error) {
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  async listTask(body: TaskListPaginationDto, res, req) {
    try {
      const limit = body.limit ? Number(body.limit) : 10;
      const page = body.page ? Number(body.page) : 1;
      const skip = (page - 1) * limit;

      console.log("req.user._id: ", req.user._id);
      const aggregateQuery = [];

      aggregateQuery.push({
        $match: {
          $expr: {
            $or: [
              {
                $eq: [
                  "$developerId",
                  new mongoose.Types.ObjectId(req.user._id),
                ],
              },
              {
                $eq: ["$assignedTo", new mongoose.Types.ObjectId(req.user._id)],
              },
            ],
          },
        },
      });

      aggregateQuery.push({
        $lookup: {
          from: "table_developer",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedDetails",
        },
      });

      aggregateQuery.push({
        $unwind: {
          path: "$assignedDetails",
          preserveNullAndEmptyArrays: true,
        },
      });

      aggregateQuery.push({
        $group: {
          _id: null,
          todoTasks: {
            $push: {
              $cond: [
                {
                  $eq: ["$status", "todo"],
                },
                {
                  _id: "$_id",
                  title: "$title",
                  assignBy: "$assignBy",
                  status: "$status",
                  assignedName: "$assignedDetails.name",
                  assignedId: "$assignedDetails._id",
                  createdDate: "$createdDate",
                },
                null,
              ],
            },
          },
          inProgressTasks: {
            $push: {
              $cond: [
                {
                  $eq: ["$status", "inProgress"],
                },
                {
                  _id: "$_id",
                  title: "$title",
                  assignBy: "$assignBy",
                  status: "$status",
                  assignedName: "$assignedDetails.name",
                  assignedId: "$assignedDetails._id",
                  inProgressDate: "$inProgressDate",
                },
                null,
              ],
            },
          },
          completedTasks: {
            $push: {
              $cond: [
                {
                  $eq: ["$status", "completed"],
                },
                {
                  _id: "$_id",
                  title: "$title",
                  assignBy: "$assignBy",
                  status: "$status",
                  assignedName: "$assignedDetails.name",
                  assignedId: "$assignedDetails._id",
                  createdDate: "$createdDate",
                },
                null,
              ],
            },
          },
          expiredTasks: {
            $push: {
              $cond: [
                {
                  $eq: ["$status", "expired"],
                },
                {
                  _id: "$_id",
                  title: "$title",
                  assignBy: "$assignBy",
                  status: "$status",
                  assignedName: "$assignedDetails.name",
                  assignedId: "$assignedDetails._id",
                  createdDate: "$createdDate",
                },
                null,
              ],
            },
          },
        },
      });

      aggregateQuery.push({
        $project: {
          todoTasks: {
            $filter: {
              input: "$todoTasks",
              as: "task",
              cond: {
                $ne: ["$$task", null],
              },
            },
          },
          inProgressTasks: {
            $filter: {
              input: "$inProgressTasks",
              as: "task",
              cond: {
                $ne: ["$$task", null],
              },
            },
          },
          completedTasks: {
            $filter: {
              input: "$completedTasks",
              as: "task",
              cond: {
                $ne: ["$$task", null],
              },
            },
          },
          expiredTasks: {
            $filter: {
              input: "$expiredTasks",
              as: "task",
              cond: {
                $ne: ["$$task", null],
              },
            },
          },
        },
      });

      aggregateQuery.push({
        $facet: {
          taskList: [{ $skip: skip }, { $limit: limit }],
          total_records: [{ $count: "count" }],
        },
      });

      const taskList = await this.taskModel.aggregate(aggregateQuery);

      if (taskList) {
        taskList[0].total_records =
          taskList[0].total_records.length > 0
            ? taskList[0].total_records[0].count
            : 0;
      }

      return res.status(statusOk).json(
        successResponse(statusOk, TASK_MSG.TASK_LIST_SUCC, {
          ...taskList[0],
        })
      );
    } catch (error) {
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  async updateTask(body: UpdateTaskDto, res) {
    try {
      const findTask = await this.taskModel.findOne({
        _id: new mongoose.Types.ObjectId(body._id),
      });

      if (!findTask) {
        throw TypeExceptions.NotFoundCommonFunction("Task is not found");
      }

      await this.taskModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(body._id) },
        {
          status: body.status,
          inProgressDate: new Date().toISOString(),
        }
      );

      return res
        .status(statusOk)
        .json(successResponse(statusOk, TASK_MSG.TASK_UPDATED_SUCC, {}));
    } catch (error) {
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  async updateTaskDetails(body: UpdateTaskDetailsDto, res) {
    try {
      const findTask = await this.taskModel.findOne({
        _id: new mongoose.Types.ObjectId(body._id),
      });

      if (!findTask) {
        throw TypeExceptions.NotFoundCommonFunction("Task is not found");
      }

      await this.taskModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(body._id),
        },
        {
          ...body,
          assignedTo: new mongoose.Types.ObjectId(body.assignedTo),
        }
      );

      return res
        .status(statusOk)
        .json(successResponse(statusOk, TASK_MSG.TASK_UPDATE_DETAILS_SUCC, {}));
    } catch (error) {
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }

  async deleteTask(body: DeleteTaskDto, res) {
    try {
      const findTask = await this.taskModel.findOne({
        _id: new mongoose.Types.ObjectId(body._id),
      });

      if (!findTask) {
        throw TypeExceptions.NotFoundCommonFunction("Task is not found");
      }

      await this.taskModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(body._id),
      });

      return res
        .status(statusOk)
        .json(successResponse(statusOk, TASK_MSG.TASK_DELETE_SUCC, {}));
    } catch (error) {
      throw CustomError.UnknownError(error?.message, error?.status);
    }
  }
}
