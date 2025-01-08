import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { createTaskAPI } from "./api";
import { getAllWorker } from "./api";
import { addComment } from "./api";
import { changeStatus } from "./api";
import { editTaskAPI } from "./api";
import { AssigneHomePageInfo } from "./api";
import { getWorkerHomePageInfo } from "./api";
import { getAdminHomePageAnalytics } from "./api";
import { getAdminTasks } from "./api";


type TaskData = {
  title: string;
  description: string;
  assignees: string;
  priority: string;
  status: string;
  deadline : string
};
type comment = {
  userId : string, 
  content : string
}

type status = {
  taskId : string, 
  status : string
}
type EditTaskData = {
  taskId: string; // ID of the task to be edited
  title?: string; // Optional to allow partial updates
  description?: string;
  assignees?: string;
  priority?: string;
  status?: string;
  deadline? : string
};


export const useCreateTask = () => {
  const mutation = useMutation({
    mutationFn: (payload: TaskData) => {
      return createTaskAPI(payload);
    },
    onSuccess: async (data) => {
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
export const useEditTask = () => {
  const mutation = useMutation({
    mutationFn: (payload: EditTaskData) => {
      const { taskId, ...data } = payload;
      const updatedFields = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== undefined)
      );
      return editTaskAPI(taskId, updatedFields); // Call the editTaskAPI
    },
    onSuccess: async (data) => {
      try {
        console.log("Edited task data processed successfully");
      } catch (error) {
        console.error("Error processing edited task data:", error);
      }
      // Show success toast
      Toast.show({
        type: "success",
        text1: "Task Edited Successfully!",
        text2: "Your task changes have been saved.",
      });
    },
    onError: (error: any) => {
      console.error("Task editing error:", error);
      Toast.show({
        type: "error",
        text1: "Task Editing Failed",
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
export const useAddComment = ()=> {
  const mutation = useMutation({
    mutationFn : (payload : comment) => {
      return addComment(payload)
    }, 
    onSuccess : async(data) =>{
      const { taskId, content } = data;
      try {
        console.log("Task data processed successfully");
      } catch (error) {
        console.error("Error processing task data:", error);
      }
      Toast.show({
        type: "success",
        text1: "Comment Added Successfully!",
        text2: "Your comment has been added to this task.",
      });
    }, 
    onError : async(error : any) =>{
      console.error("Adding comment error:", error);
      Toast.show({
        type: "error",
        text1: "Error Adding Failed",
        text2: error.message || "An unexpected error occurred.",
      });
    }
  })
  return mutation; 
}
export const useChangeStatus = () => {
  const mutation = useMutation({
    mutationFn: (payload : status) => {
      return changeStatus(payload); 
    },
    onSuccess: async (data) => {
      try {
        console.log("Status changes successfully");
      } catch (error) {
        console.error("Error processing with status change:", error);
      }
      Toast.show({
        type: "success",
        text1: "Status Change Successfully!",
        text2: "You just update the status.",
      });
    },
    onError: async (error: any) => {
      console.error("Error updating status:", error);
      Toast.show({
        type: "error",
        text1: "Error Updating Status",
        text2: error.message || "An unexpected error occurred.",
      });
    },
  });

  return mutation;
};
export const useGetAssigneeHomePAgeInfo = () => {
  const mutation  = useMutation({
    mutationFn: async () => {
      const data = await AssigneHomePageInfo(); // API call to get all workers
      return data;
    },
    onSuccess: (data) => {
      console.log("Assignee home page data fetched successfully:", data); // Log the response data
    },
    onError: (error: any) => {
      console.error("Error in fetching Assignee home page data :", error); // Log the error
    },
  }); 
  return mutation;
}
export const useGetWorkerHomePageInfo = () => {
  const mutation = useMutation({
    mutationFn : async() =>{
      const data = await getWorkerHomePageInfo(); 
      return data
    },
    onSuccess: (data) => {
      console.log("Worker home page data fetched successfully:", data); // Log the response data
    },
    onError: (error: any) => {
      console.error("Error in fetching Worker home page data :", error); // Log the error
    },
  }); 
  return mutation;
}
export const useAdminHomePageAnalytics = () =>{
  const mutation = useMutation({
    mutationFn : async() =>{
      const data = await getAdminHomePageAnalytics(); 
      return data
    }, 
    onSuccess : (data) =>{
      console.log("Admin home page data fetched successfully:", data)
    }, 
    onError : (error : any) =>{
      console.error("Error in fetching Admin home page data :", error);
    }
  }); 
  return mutation;
}
export const useAdminTasks = () =>{
  const mutation = useMutation({
    mutationFn : async() => {
      const data = await getAdminTasks(); 
      return data
    },
    onSuccess: (data) => {
      console.log("Worker home page data fetched successfully:", data); // Log the response data
    },
    onError: (error: any) => {
      console.error("Error in fetching Worker home page data :", error); // Log the error
    },
  }); 
  return mutation; 
}