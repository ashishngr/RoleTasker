import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import TaskList from '../../components/TaskList';
import { Ionicons } from "@expo/vector-icons"; 

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
  const [tasks, setTasks] = useState<Task[]>([
    {
        id: "1",
        title: "Task 1",
        owner: "Alice",
        assignees: ["Bob", "Charlie"],
        priority: "High",
        status: "In Progress",
    },
    {
        id: "2",
        title: "Task 2",
        owner: "Dave",
        assignees: ["Eve"],
        priority: "Low",
        status: "Backlog",
    },
    {
        id: "3",
        title: "Task 3",
        owner: "Frank",
        assignees: ["Grace", "Heidi"],
        priority: "Medium",
        status: "Done",
    },
    {
        id: "4",
        title: "Task 4",
        owner: "Isaac",
        assignees: ["Jack"],
        priority: "High",
        status: "Archived",
    },
    {
        id: "5",
        title: "Task 5",
        owner: "Karen",
        assignees: ["Liam"],
        priority: "Medium",
        status: "Backlog",
    },
    {
        id: "6",
        title: "Task 6",
        owner: "Mallory",
        assignees: ["Nancy", "Oscar"],
        priority: "Low",
        status: "In Progress",
    },
    {
        id: "7",
        title: "Task 7",
        owner: "Paul",
        assignees: ["Quinn"],
        priority: "High",
        status: "Done",
    },
    {
        id: "8",
        title: "Task 8",
        owner: "Rachel",
        assignees: ["Sam"],
        priority: "Medium",
        status: "In Progress",
    },
    {
        id: "9",
        title: "Task 9",
        owner: "Ted",
        assignees: ["Uma", "Victor"],
        priority: "Low",
        status: "Archived",
    },
    {
        id: "10",
        title: "Task 10",
        owner: "Wendy",
        assignees: ["Xander", "Yara"],
        priority: "High",
        status: "Backlog",
    },
    {
        id: "11",
        title: "Task 11",
        owner: "Zara",
        assignees: ["Amy"],
        priority: "Medium",
        status: "Archived",
    },
    {
        id: "12",
        title: "Task 12",
        owner: "Blake",
        assignees: ["Cara"],
        priority: "Low",
        status: "Done",
    },
    {
        id: "13",
        title: "Task 13",
        owner: "Dan",
        assignees: ["Ellen", "Fred"],
        priority: "High",
        status: "In Progress",
    },
    {
        id: "14",
        title: "Task 14",
        owner: "Gina",
        assignees: ["Hank"],
        priority: "Medium",
        status: "Backlog",
    },
    {
        id: "15",
        title: "Task 15",
        owner: "Ivy",
        assignees: ["James", "Ken"],
        priority: "Low",
        status: "In Progress",
    }
]); 
const handleSearch = (query: string) => {
  setSearchQuery(query);
  // Add filtering logic based on search query if required
};



  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
       {/* Task List */}
       <TaskList tasks={tasks.filter(task => task.title.includes(searchQuery))} />
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