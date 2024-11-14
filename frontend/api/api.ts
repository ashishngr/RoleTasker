import { apiCall } from "./apiClient";
import getHeadersWithToken from "../utils/getHeadersWithToken";

export interface SignUpPayload {
  firstName: string;
  lastName : String;
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
  dueDate: string;  // ISO 8601 date string
}
export interface AllTasks {
  _id: string;  // The unique task ID from MongoDB
  title: string;
  description: string;
  ownerName: string;
  assignees: {
    userId: string;
    email: string;
    _id: string;  // Unique identifier for the assignee relation (if needed)
  }[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
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
export const getAllWorker = async() =>{
  try {
    const response = await apiCall<{ success: boolean; data: Array<{ _id: string; firstName: string; lastName: string; email: string }> }>(
      "/api/v1/worker",  
      "GET"
    );
    return response;
  } catch (error) {
    console.error("Error fetching workers:", error);
    throw error;
  }
}
export const getAllTasks = async(
  {
    SortBy,
    status,
    priority,
    createdAt,
  }: {
    SortBy?: string;
    status?: string;
    priority?: string;
    createdAt?: string;
  }
) =>{
  try {
    const params = new URLSearchParams();
    
    if (sortBy) {
      params.append("SortBy", sortBy);
    }
    if (status) {
      params.append("Status", status);
    }
    if (priority) {
      params.append("Priority", priority);
    }
    if (createdAt) {
      params.append("CreatedAt", createdAt);
    }
    const response = await apiCall<{
      message: String,
      tasks : AllTasks[] 
    }>(
     `/api/v1/tasks?${params.toString()}`,
      "GET"
    )
    console.log("Response : Get all tasks", response); 
    return response
  } catch (error) {
    console.error("Error fetching workers:", error);
    throw error;
  }
}