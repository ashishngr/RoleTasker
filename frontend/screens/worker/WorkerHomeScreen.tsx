// screens/WorkerHomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGetWorkerHomePageInfo } from '../../api/apiMutations';

type WorkerStackParamList = {
  WorkerTasks: undefined;
  WorkerAnalytics: undefined
}
type WorkerNavbarProps = StackNavigationProp<WorkerStackParamList>;
const formatDate = (isoDate) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(isoDate).toLocaleDateString('en-US', options);
};

const WorkerHomeScreen: React.FC = () => {

  const [data, setData] = useState({
    counts: { completed: 0, inProgress: 0, overdue: 0 },
    taskCloseToDueDate: [],
    recentOverdueTasks: []
  })

  const navigation = useNavigation<WorkerNavbarProps>();
  const handleNavigate = (screenName: string) => {
    navigation.navigate('WorkerRoutes', { screen: screenName });
  };
  const { mutate: fetchWorkerInformation, data: workerData } = useGetWorkerHomePageInfo();

  useEffect(() => {
    fetchWorkerInformation()
  }, []);

  useEffect(() => {
    setData({
      counts: workerData?.counts || { done: 0, inProgress: 0, overdue: 0 },
      taskCloseToDueDate: workerData?.taskCloseToDueDate || [],
      recentOverdueTasks: workerData?.recentOverdueTasks || []
    });
  }, [workerData]);

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
            <Text style={styles.cardTitle}>{data.counts.inProgress} Inprogress Task</Text>∏
          </View>
          <View style={styles.card}>
            <FontAwesome name="check-circle" size={40} color="#4CAF50" />
            <Text style={styles.cardTitle}>{data.counts.completed} Completed</Text>
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
          <TouchableOpacity style={styles.widget} onPress={() => handleNavigate('WorkerTasks')}>
            <FontAwesome name="list" size={40} color="#FF6F61" />
            <Text style={styles.widgetText} >Task List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.widget} onPress={() => handleNavigate('WorkerAnalytics')}>
            <Ionicons name="analytics" size={40} color="#4CAF50" />
            <Text style={styles.widgetText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Upcoming deadline tasks */}
      <View style={styles.taskSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          <TouchableOpacity >
            <Ionicons name="arrow-forward" size={30} color="#4B9CD3" onPress={() => handleNavigate('WorkerTasks')} />
          </TouchableOpacity>
        </View> 
        {data.taskCloseToDueDate.map(task => (
          <View key={task._id} style={styles.taskCard}>
            <View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskDetails, styles[`priority${task.priority}`]]}>Priority: {task.priority}</Text>
              <Text style={styles.taskDetails}>Due: {formatDate(task.deadline)} </Text>
            </View>
            <Text style={[styles.status, styles[task.status.toLowerCase().replace(' ', '')]]}>{task.status}</Text>
          </View>
        ))}
      </View > 
      {/* Recent overdue */} 
      <View style={styles.taskSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Overdues</Text>
          <TouchableOpacity >
            <Ionicons name="arrow-forward" size={30} color="#4B9CD3" onPress={() => handleNavigate('WorkerTasks')} />
          </TouchableOpacity>
        </View> 
        {data.recentOverdueTasks.map(task => (
          <View key={task._id} style={styles.taskCard}>
            <View>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskDetails, styles[`priority${task.priority}`]]}>Priority: {task.priority}</Text>
              <Text style={styles.taskDetails}>Due: {formatDate(task.deadline)} </Text>
            </View>
            <Text style={[styles.status, styles[task.status.toLowerCase().replace(' ', '')]]}>{task.status}</Text>
          </View>
        ))}
      </View >



    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    marginBottom: 58
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B9CD3",
    marginBottom: 10,
  },

});
export default WorkerHomeScreen;
