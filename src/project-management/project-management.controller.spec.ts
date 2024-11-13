import { Test, TestingModule } from "@nestjs/testing";
import { ProjectManagementService } from "./project-management.service";
import { ProjectManagementController } from "./project-management.controller";

describe("ProjectManagementController", () => {
  let controller: ProjectManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectManagementController],
      providers: [ProjectManagementService],
    }).compile();

    controller = module.get<ProjectManagementController>(
      ProjectManagementController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
