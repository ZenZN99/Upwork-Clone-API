import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BudgetType, ProjectStatus } from 'src/enums/project.enum';
import { UserRole } from 'src/enums/user.enum';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { AuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(clientId: string, data: Project) {
    const { title, description, budget, budgetType } = data;

    if (!title || !description || !budgetType || budget === undefined) {
      throw new BadRequestException('All fields are required');
    }

    if (!Object.values(BudgetType).includes(budgetType)) {
      throw new BadRequestException('Invalid budget type');
    }

    if (budget < 25) {
      throw new BadRequestException('Minimum budget is 25$');
    }

    return this.projectModel.create({
      clientId,
      title,
      description,
      budgetType,
      budget,
      status: ProjectStatus.OPEN,
    });
  }

  async getAllProjects() {
    const projects = await this.projectModel
      .find()
      .sort({ createdAt: -1 })
      .lean();
    return projects;
  }

  async getProjectById(projectId: string) {
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found!');
    }
    return project;
  }

  async getProjectsByClient(clientId: string) {
    const projects = await this.projectModel
      .find({ clientId })
      .sort({ createdAt: -1 });
    return projects;
  }

  async updateProject(authUser: AuthUser, projectId: string, data: Project) {
    const project = await this.projectModel.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isOwner = project.clientId === authUser._id;
    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to update this project',
      );
    }

    const { title, description, budget, budgetType, status } = data;

    const updateData: Partial<Project> = {};

    if (title !== undefined) {
      if (!title.trim()) {
        throw new BadRequestException('Title cannot be empty');
      }
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (budget !== undefined) {
      if (budget < 25) {
        throw new BadRequestException('Minimum budget is 25$');
      }
      updateData.budget = budget;
    }

    if (budgetType !== undefined) {
      if (!Object.values(BudgetType).includes(budgetType)) {
        throw new BadRequestException('Invalid budget type');
      }
      updateData.budgetType = budgetType;
    }

    if (status !== undefined) {
      if (!Object.values(ProjectStatus).includes(status)) {
        throw new BadRequestException('Invalid status');
      }
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    const updatedProject = await this.projectModel.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true },
    );

    return {
      success: 'Project updated successfully',
      project: updatedProject,
    };
  }

  async deleteProject(authUser: AuthUser, projectId: string) {
    const project = await this.projectModel.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isOwner = project.clientId === authUser._id;

    const isAdmin = authUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'You are not allowed to delete this project',
      );
    }

    await this.projectModel.findByIdAndDelete(projectId);

    return {
      success: 'Project deleted successfully',
    };
  }
}
