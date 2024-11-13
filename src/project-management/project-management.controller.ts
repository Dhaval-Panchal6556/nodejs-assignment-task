import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { ProjectManagementService } from "./project-management.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateProjectManagementDto } from "./dto/create-project-management.dto";
import { Request, Response } from "express";
import { UpdateProjectManagementDto } from "./dto/update-project-management.dto";
import { PaginationDto } from "src/common/dto/common.dto";

@Controller("users/project")
@ApiTags("Project Management")
@ApiBearerAuth()
export class ProjectManagementController {
  constructor(
    private readonly projectManagementService: ProjectManagementService
  ) {}

  @Post("add")
  async createProject(
    @Body() body: CreateProjectManagementDto,
    @Req() request: Request,
    @Res() response: Response
  ) {
    return this.projectManagementService.createProject(body, request, response);
  }

  @Patch("edit/:id")
  async updateProject(
    @Param("id") id: string, // Get user ID from URL params
    @Body() body: UpdateProjectManagementDto,
    @Req() request: Request,
    @Res() response: Response
  ) {
    return this.projectManagementService.updateProject(
      id,
      body,
      request,
      response
    );
  }

  @Get("view/:id")
  async viewProject(
    @Param("id") id: string, // Get user ID from URL params
    @Res() response: Response
  ) {
    return this.projectManagementService.viewProject(id, response);
  }

  @Post("list")
  async listProject(
    @Body() body: PaginationDto,
    @Req() request: Request,
    @Res() response: Response
  ) {
    return this.projectManagementService.listProject(body, request, response);
  }

  @Delete("delete/:id")
  async deleteProject(
    @Param("id") id: string, // Get user ID from URL params
    @Res() response: Response
  ) {
    return this.projectManagementService.deleteProject(id, response);
  }
}
