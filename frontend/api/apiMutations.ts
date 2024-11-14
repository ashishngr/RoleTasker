import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { createTaskAPI } from "./api";
import { getAllWorker } from "./api";
import { getAllTasks } from "./api";

type TaskData = {
  title: string;
  description: string;
  assignees: string;
  priority: string;
  status: string;
};

export const useCreateTask = () => {
  const mutation = useMutation({
    mutationFn: (payload: TaskData) => {
      return createTaskAPI(payload);
    },
    onSuccess: async (data) => {
      console.log("Task created successfully:", data);

      const { taskId, assignee } = data;
      try {
        console.log("Task data processed successfully");
      } catch (error) {
        console.error("Error processing task data:", error);
      }
      // Show success toast
      Toast.show({
        type: "success",
        text1: "Task Created Successfully!",
        text2: "Your task has been added to the system.",
      });
    },
    onError: (error: any) => {
      console.error("Task creation error:", error);
      Toast.show({
        type: "error",
        text1: "Task Creation Failed",
        text2: error.message || "An unexpected error occurred.",
      });
    },
  });
  return mutation;
};

export const useGetAllWorkers = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const data = await getAllWorker(); // API call to get all workers
      return data;
    },
    onSuccess: (data) => {
      console.log("Workers fetched successfully:", data); // Log the response data
    },
    onError: (error: any) => {
      console.error("Error fetching workers:", error); // Log the error
    },
  });
  return mutation;
};
export const useGetAllTasks = ({
  SortBy,
  status,
  priority,
  createdAt,
}: {
  SortBy?: string;
  status?: string;
  priority?: string;
  createdAt?: string;
}) =>{
  const mutation = useMutation({
    mutationFn : async() => {
      const data = await getAllTasks({
        SortBy,
        status,
        priority,
        createdAt,
      });
      console.log("Data Get All filtered task")
      return data
    }, 
    onSuccess : (data) =>{
      console.log("All tasks fetched success fully", data)
    }, 
    onError : (error: any) =>{
      console.log("Error in fetching all tasks", error)
    }
  })
  return mutation;
}

