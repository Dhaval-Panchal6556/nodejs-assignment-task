import { Controller, Post, Body, Res, Req } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TaskListPaginationDto } from "./dto/task-list.dto";
import { UpdateTaskDetailsDto, UpdateTaskDto } from "./dto/update-task.dto";
import { DeleteTaskDto } from "./dto/delete-task.dto";

@ApiTags("Task Management")
@ApiBearerAuth()
@Controller("users/task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post("add")
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.taskService.createTask(createTaskDto, req, res);
  }

  @Post("list")
  listTask(
    @Body() taskListDto: TaskListPaginationDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.taskService.listTask(taskListDto, res, req);
  }

  @Post("update")
  updateTask(@Body() updateTaskDto: UpdateTaskDto, @Res() res: Response) {
    return this.taskService.updateTask(updateTaskDto, res);
  }

  @Post("updateTaskDetails")
  updateTaskDetails(
    @Body() updateTaskDetailsDto: UpdateTaskDetailsDto,
    @Res() res: Response,
  ) {
    return this.taskService.updateTaskDetails(updateTaskDetailsDto, res);
  }

  @Post("delete")
  deleteTask(@Body() deleteTaskDto: DeleteTaskDto, @Res() res: Response) {
    return this.taskService.deleteTask(deleteTaskDto, res);
  }
}
