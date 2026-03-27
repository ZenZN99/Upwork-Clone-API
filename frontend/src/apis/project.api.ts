import type { BudgetType, ProjectStatus } from "../types/project";
import { BACKEND_URL } from "./user.api";

export const createProject = async (
  title: string,
  description: string,
  budget: number,
  budgetType: BudgetType,
) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/project/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title, description, budget, budgetType }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllProjects = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/project/projects`, {
      method: "GET",
      headers: {},
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getProjectsByClient = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/project/client`, {
      method: "GET",

      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const updateProject = async (
  title: string,
  description: string,
  budget: number,
  budgetType: BudgetType,
  status: ProjectStatus,
  projectId: string,
) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/project/update/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title, description, budget, budgetType, status }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/project/delete/${projectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};
