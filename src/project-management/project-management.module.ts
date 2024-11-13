import { Module } from "@nestjs/common";
import { ProjectManagementService } from "./project-management.service";
import { ProjectManagementController } from "./project-management.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Projects, ProjectsSchema } from "./schemas/project-management.schema";
import { LoggerModule } from "src/common/logger/logger.module";
import { Users, UsersSchema } from "src/users/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Projects.name, schema: ProjectsSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
    LoggerModule,
  ],
  controllers: [ProjectManagementController],
  providers: [ProjectManagementService],
})
export class ProjectManagementModule {}
