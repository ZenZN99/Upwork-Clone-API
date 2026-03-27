import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ClientGuard } from 'src/guards/client.guard';
import { Project } from 'src/schemas/project.schema';
import { ProjectService } from 'src/services/project.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @UseGuards(AuthGuard, ClientGuard)
  createProject(@Req() req: RequestWithUser, @Body() data: Project) {
    return this.projectService.createProject(req.user._id, data);
  }

  @Get('projects')
  @UseGuards(AuthGuard)
  getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Get('project/:projectId')
  @UseGuards(AuthGuard)
  getProjectById(@Param('projectId') projectId: string) {
    return this.projectService.getProjectById(projectId);
  }

  @Get('client')
  @UseGuards(AuthGuard, ClientGuard)
  getProjectsByClient(@Req() req: RequestWithUser) {
    return this.projectService.getProjectsByClient(req.user._id);
  }

  @Put('update/:projectId')
  @UseGuards(AuthGuard)
  updateProject(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
    @Body() data: Project,
  ) {
    return this.projectService.updateProject(req.user, projectId, data);
  }

  @Delete('delete/:projectId')
  @UseGuards(AuthGuard)
  deleteProject(
    @Req() req: RequestWithUser,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.deleteProject(req.user, projectId);
  }
}
