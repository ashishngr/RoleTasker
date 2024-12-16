import { apiCall } from "./apiClient";
import getHeadersWithToken from "../utils/getHeadersWithToken";

export interface SignUpPayload {
  firstName: string;
  lastName: String;
  email: string;
  password: string;
  role: [String];
}
export interface SignInPayload {
  email: string;
  password: string;
}
export interface CreateTaskPayload {
  title: string;
  description: string;
  assignees: {
    userId: string;
    email: string;
  }[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
  deadline: string; // ISO 8601 date string
}
export interface AllTasks {
  _id: string; // The unique task ID from MongoDB
  title: string;
  description: string;
  ownerName: string;
  assignees: {
    userId: string;
    email: string;
    _id: string; // Unique identifier for the assignee relation (if needed)
  }[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
}
export interface commentPayload {
  taskId: string;
  content: string;
}
export interface TaskWithCommentsResponse {
  _id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  assignees: Assignee[];
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Done"; // Adjust the statuses based on the actual possible values
  isArchived: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  comments: Comment[];
}
export interface Assignee {
  userId: string;
  email: string;
  _id: string;
}

export interface Comment {
  _id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}
export interface statusPayload {
  status: string;
  taskId: string;
}
export interface editTaskPayload {
  title?: string; // Optional to allow partial updates
  description?: string;
  assignees?: {
    userId: string;
    email: string;
  }[];
  priority?: "High" | "Medium" | "Low";
  status?: "Done" | "In Progress" | "Backlog" | "Archived";
  deadline: string;
}

export interface TaskByStatus {
  count: number;
  status: "Done" | "In Progress" | "Backlog" | "Archived";
}

// Interface for tasks grouped by priority
export interface TaskByPriority {
  count: number;
  priority: "High" | "Medium" | "Low";
}

// Interface for task creation over time
export interface TaskCreationOverTime {
  count: number;
  year: number;
  month: number;
  day: number;
}

// Interface for tasks assigned to workers
export interface TasksAssignedToWorker {
  count: number;
  userId: string;
  email: string;
}

// Interface for the analytics data
export interface AnalyticsData {
  tasksByStatus: TaskByStatus[];
  tasksByPriority: TaskByPriority[];
  taskCreationOverTime: TaskCreationOverTime[];
  tasksAssignedToWorkers: TasksAssignedToWorker[];
}
export interface TasksOverTime {
  count: number;
  year: number;
  month: number;
  day: number;
}
export interface TaskByAssigner {
  name: string; // Name of the assigner (owner of the task)
  count: number; // Number of tasks assigned by this user
}

// Interface for worker analytics
export interface workerAnalytics {
  tasksByStatus: TaskByStatus[];
  tasksByPriority: TaskByPriority[];
  tasksOverTime: TasksOverTime[];
  tasksByAssigner: TaskByAssigner[];
}

// Response format for analytics API
export interface AnalyticsAPIResponse {
  success: boolean;
  data: AnalyticsData[];
}
export interface WorkerAnalyticsAPIResponse {
  message: string;
  data: workerAnalytics[];
}

interface Task {
  title: string;
  description: string;
  createdAt: string;
  status: string;
  deadline?: string;
}

interface AssigneeHomePageInformation {
  inProgressCount: number;
  doneCount: number;
  overdueCount: number;
  latestTasks: Task[];
  overdueTasks: Task[];
}

// Mutations for signUp and signIn
export const signUpApi = async (payload: SignUpPayload) => {
  const { firstName, lastName, email, password } = payload;
  return apiCall<{ message: string; user: object }>("/api/v1/signUp", "POST", {
    firstName,
    lastName,
    email,
    password,
  });
};
export const signInApi = async (payload: SignInPayload) => {
  const { email, password } = payload;
  return apiCall<{ token: string; user: object }>("/api/v1/signin", "POST", {
    email,
    password,
  });
};

export const createTaskAPI = async (payload: CreateTaskPayload) => {
  try {
    const response = await apiCall<{ message: string; task: object }>(
      "/api/v1/createTask",
      "POST",
      payload
    );

    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};
export const editTaskAPI = async (taskId: string, payload: editTaskPayload) => {
  try {
    const response = await apiCall<{ message: string; task: object }>(
      `/api/v1/task/${taskId}`,
      "PUT",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error editing task:", error);
    throw error;
  }
};
export const getAllWorker = async () => {
  try {
    const response = await apiCall<{
      success: boolean;
      data: Array<{
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      }>;
    }>("/api/v1/worker", "GET");
    return response;
  } catch (error) {
    console.error("Error fetching workers:", error);
    throw error;
  }
};
export const getAllTasks = async (params?: Record<string, any>) => {
  try {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    console.log("queryString", queryString);
    const response = await apiCall<{
      message: String;
      tasks: AllTasks[];
    }>(`/api/v1/tasks${queryString}`, "GET");
    return response;
  } catch (error) {
    console.error("Error fetching workers:", error);
    throw error;
  }
};
export const getAllWorkersTasks = async (params?: Record<string, any>) => {
  try {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    console.log("queryString------------------->--", queryString);
    const response = await apiCall<{
      message: String;
      tasks: AllTasks[];
    }>(`/api/v1/getWorkerTasks${queryString}`, "GET");
    console.log("Response : Get all tasks=============>", response);
    return response;
  } catch (error) {
    console.error("Error fetching workers:", error);
    throw error;
  }
};
export const addComment = async (payload: commentPayload) => {
  try {
    const response = await apiCall<{ message: string; comment: object }>(
      "/api/v1/comment",
      "POST",
      payload
    );
    console.log("Response -------------?????????????-----------", response);
    return response;
  } catch (error) {
    console.error("Error fetching workers:", error);
    throw error;
  }
};
export const getTaskWithComment = async (params?: { taskId: string }) => {
  try {
    if (!params || !params.taskId) {
      throw new Error("Task ID is required to fetch task details.");
    }
    const { taskId } = params;
    const endpoint = `/api/v1/task/${taskId}`;
    console.log("Fetching endpoint:", endpoint);
    const response = await apiCall<{
      message: String;
      tasks: AllTasks[];
    }>(endpoint, "GET");
    console.log("Response : Get tasks", response?.data);
    return response;
  } catch (error) {
    console.error("Error fetching task with comment:", error);
    throw error;
  }
};
export const changeStatus = async (payload: statusPayload) => {
  try {
    const { taskId, status } = payload;
    console.log("TaskId", taskId);
    console.log("status", status);

    const endpoint = `/api/v1/task/${taskId}/status`;
    console.log("Fetching endpoint:", endpoint);
    const response = await apiCall<{
      message: string;
    }>(endpoint, "PUT", status);
    console.log("Status change response:", response);
    return response;
  } catch (error) {
    console.error("Error changing task status:::", error);
    throw error;
  }
};
export const getAssigneeAnalyticsData = async (
  params?: Record<string, any>
) => {
  try {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    console.log("queryString=============>", queryString);

    const response = await apiCall<AnalyticsAPIResponse>(
      `/api/v1/task/analytics${queryString}`,
      "GET"
    );

    return response;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
export const getWorkerAnalyticsData = async (params?: Record<string, any>) => {
  try {
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    console.log("queryString=============>", queryString);
    const response = await apiCall<WorkerAnalyticsAPIResponse>(
      `/api/v1/worker/analytics${queryString}`,
      "GET"
    );
    return response;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
export const AssigneHomePageInfo = async () => {
  try {
    const response = await apiCall<AssigneeHomePageInformation>(
      "/api/v1/assignee/info",
      "GET"
    );
    return response;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
