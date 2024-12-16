import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TaskList from '../../components/TaskList'; 
import CreateTaskModal from '../../components/CreateTaskModal'; 
import { useCreateTask } from '../../api/apiMutations';
// import { useGetAllTasks } from '../../api/apiMutations';
import Toast from 'react-native-toast-message';

type Task = {
  id: string;
  title: string;
  owner: string;
  assignees: string[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
};
const Tasks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setModalVisible] = useState(false); 
  const { mutate: createTask } = useCreateTask();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add filtering logic based on search query if required
  };
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const handleCreateTask = (task: { title: string; description: string; assignees: string[]; priority: string; status: string; deadline : string }) => {
    const taskPayload = {
      title: task.title,
      description: task.description,
      assignees: task.assignees, // Send only email of the selected assignee
      priority: task.priority,
      status: task.status, 
      deadline : task.deadline
    };
    console.log("Task Payload --------+++++++++----------:::::::---------", taskPayload)

    createTask(taskPayload, {
      onSuccess: (newTask) => {
        // Append the new task to the tasks list
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setModalVisible(false); // Close modal after successful task creation

        // Display success toast
        Toast.show({
          type: 'success',
          text1: 'Task Created Successfully!',
          text2: 'Your task has been added to the system.',
        });
      },
      onError: (error) => {
        console.error("Error creating task:", error);
        // Display error toast
        Toast.show({
          type: 'error',
          text1: 'Task Creation Failed',
          text2: error.message || 'An unexpected error occurred.',
        });
      },
    });
  };
  return (
    <View style={styles.container}>
      {/* Create Task Button */}
      <TouchableOpacity style={styles.createTaskButton} onPress={handleOpenModal}>
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.createTaskButtonText}>Create Task</Text>
      </TouchableOpacity>
      <CreateTaskModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onCreateTask={handleCreateTask}
      />

      {/* Task List */}
      <TaskList />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  createTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4B9CD3",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  createTaskButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B9CD3",
    marginBottom: 10,
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  taskDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});


export default Tasks;