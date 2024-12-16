// screens/AssignerHomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import { useGetAssigneeHomePAgeInfo } from '../../api/apiMutations';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import CreateTaskModal from '../../components/CreateTaskModal';
import { useCreateTask } from '../../api/apiMutations';

type AssigneeStackParamList = {
  AssigneeTasks: undefined;
  AssigneeAnalytics: undefined;
};
type AssigneeNavbarProps = StackNavigationProp<AssigneeStackParamList>;
type Task = {
  id: string;
  title: string;
  owner: string;
  assignees: string[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
};


const formatDate = (isoDate) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(isoDate).toLocaleDateString('en-US', options);
};


const AssignerHomeScreen: React.FC = () => {


  // Sample Data for Task List and Personalization Feeds
  const [data, setData] = useState({
    counts: { done: 0, inProgress: 0, overdue: 0 },
    latestTasks: [],
    overdueTasks: [],
  });
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const { mutate: createTask } = useCreateTask();
  const navigation = useNavigation<AssigneeNavbarProps>();
  const handleNavigate = (screenName: string) => {
    navigation.navigate('AssigneeRoutes', { screen: screenName });
  };
  const { mutate: fetchAssigneeInformation, data: assigneeData, isLoading } = useGetAssigneeHomePAgeInfo();
  useEffect(() => {
    fetchAssigneeInformation();
  }, []);

  useEffect(() => {
    setData({
      counts: assigneeData?.counts || { done: 0, inProgress: 0, overdue: 0 },
      latestTasks: assigneeData?.latestTasks || [],
      overdueTasks: assigneeData?.overdueTasks || [],
    });
  }, [assigneeData]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleCreateTask = (task: { title: string; description: string; assignees: string[]; priority: string; status: string; deadline: string }) => {
    const taskPayload = {
      title: task.title,
      description: task.description,
      assignees: task.assignees,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline
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
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Ionicons name="information-circle-outline" size={10} color="#4B9CD3" style={styles.icon} />
        <Text style={styles.title}>Welcome to RoleTasker!</Text>
        <Text style={styles.subtitle}>Empowering you to manage and delegate tasks effortlessly.</Text>
      </View>

      {/* Overview Section */}
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.overviewCards}>
          <View style={styles.card}>
            <MaterialIcons name="hourglass-top" size={40} color="#FF6F61" />
            <Text style={styles.cardTitle}>{data.counts.inProgress} Inprogress Tasks</Text>∏
          </View>
          <View style={styles.card}>
            <FontAwesome name="check-circle" size={40} color="#4CAF50" />
            <Text style={styles.cardTitle}>{data.counts.done} Completed</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="alert-circle" size={40} color="#FF9800" />
            <Text style={styles.cardTitle}>{data.counts.overdue} Overdue</Text>
          </View>
        </View>
      </View>

      {/* Actionable Widgets */}
      <View style={styles.taskSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.widgets}>
          <TouchableOpacity style={styles.widget} onPress={handleOpenModal}>
            <Ionicons name="add-circle-outline" size={40} color="#4B9CD3" />
            <Text style={styles.widgetText}>Add Task</Text>
            <CreateTaskModal
              visible={isModalVisible}
              onClose={handleCloseModal}
              onCreateTask={handleCreateTask}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.widget} onPress={() => handleNavigate('AssigneeTasks')}>
            <FontAwesome name="list" size={40} color="#FF6F61" />
            <Text style={styles.widgetText} >Task List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.widget} onPress={() => handleNavigate('AssigneeAnalytics')}>
            <Ionicons name="analytics" size={40} color="#4CAF50" />
            <Text style={styles.widgetText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task List Section */}
      <View style={styles.taskSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} >Your Tasks</Text>
          <TouchableOpacity onPress={() => console.log('Navigate to deadlines')}>
            <Ionicons name="arrow-forward" size={30} color="#4B9CD3" onPress={() => handleNavigate('AssigneeTasks')} />
          </TouchableOpacity>
        </View>
        {data.latestTasks.map(task => (
          <View key={task.id} style={styles.taskCard}>
            <View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskDetails, styles[`priority${task.priority}`]]}>Priority: {task.priority}</Text>
              <Text style={styles.taskDetails}>Due: {formatDate(task.deadline)} </Text>
            </View>
            <Text style={[styles.status, styles[task.status.toLowerCase().replace(' ', '')]]}>{task.status}</Text>
          </View>
        ))}
      </View>


      <View style={styles.taskSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          <TouchableOpacity onPress={() => console.log('Navigate to deadlines')}>
            <Ionicons name="arrow-forward" size={30} color="#4B9CD3" onPress={() => handleNavigate('AssigneeTasks')} />
          </TouchableOpacity>
        </View>
        {data.overdueTasks.map(task => (
          <View key={task.id} style={styles.taskCard}>
            <View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskDetails, styles[`priority${task.priority}`]]}>Priority: {task.priority}</Text>
              <Text style={styles.taskDetails}>Due: {formatDate(task.deadline)} </Text>
            </View>
            <Text style={[styles.status, styles[task.status.toLowerCase().replace(' ', '')]]}>{task.status}</Text>
          </View>
        ))}
      </View>

      {/* Personalization Feeds */}
      <View style={styles.feedsSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {/* {feeds.map(feed => (
          <View key={feed.id} style={styles.feedCard}>
            <Text style={styles.feedMessage}>{feed.message}</Text>
            <Text style={styles.feedTime}>{feed.time}</Text>
          </View>
        ))} */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    marginBottom: 44
  },
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 5,
    backgroundColor: "#4B9CD3",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0F7FF",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B9CD3",
    marginVertical: 10,
  },
  overviewSection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  overviewCards: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  taskSection: {
    paddingHorizontal: 20,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskDetails: {
    fontSize: 14,
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: "center",
  },

  backlog: {
    backgroundColor: "#FFE4E1",
    color: "#D32F2F",
  },

  inprogress: {
    backgroundColor: "#FFF3E0",
    color: "#FF9800",
  },
  done: {
    backgroundColor: "#E8F5E9",
    color: "#4CAF50",
  },
  priorityHigh: {
    backgroundColor: "#FFE4E1",
    color: "#D32F2F",
  },
  priorityMedium: {
    backgroundColor: "#FFFDE7",
    color: "#FBC02D",
  },
  priorityLow: {
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
  },


  widgets: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  widget: {
    alignItems: "center",
  },
  widgetText: {
    marginTop: 5,
    fontSize: 14,
    color: "#6C757D",
  },
  feedsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  feedCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  feedMessage: {
    fontSize: 16,
    fontWeight: "500",
  },
  feedTime: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 5,
  },
  deadlineSection: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  deadlineCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  deadlineDate: {
    fontSize: 14,
    color: "#6C757D",
  },
  deadlineStatus: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});


export default AssignerHomeScreen;
