// screens/WorkerHomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const WorkerHomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Ionicons name="information-circle-outline" size={80} color="#4B9CD3" style={styles.icon} />
          <Text style={styles.title}>Welcome to RoleTasker!</Text>
          <Text style={styles.subtitle}>Your go-to tool for efficient task completion and tracking.</Text>
        </View>

        {/* About the Application */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About RoleTasker</Text>
          <Text style={styles.sectionContent}>
            RoleTasker is a collaborative platform designed to enhance productivity and streamline tasks
            across roles. Whether you’re an Admin, Assigner, or Worker, RoleTasker offers tools to
            support and simplify your work.
          </Text>
        </View>

        {/* Worker Role Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Role as a Worker</Text>
          <Text style={styles.sectionContent}>
            As a Worker, you are responsible for completing assigned tasks efficiently. Your role
            involves staying updated on task statuses, meeting deadlines, and communicating with
            your assigner for any clarifications.
          </Text>
        </View>

        {/* How Worker Can Use the App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use RoleTasker as a Worker</Text>
          <Text style={styles.sectionContent}>
            1. Check the "Tasks" section to view assigned tasks and track your progress.{'\n'}
            2. Use the "Notifications" feature to stay informed about task updates and deadlines.{'\n'}
            3. Navigate to the "Profile" section to update your status and view your performance.{'\n'}
            4. Communicate effectively with your assigner through the "Messages" feature for smooth task management.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    marginBottom: 80,
  },
  welcomeSection: {
    alignItems: "center",
    paddingVertical: 20,
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
  section: {
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4B9CD3",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: "#6C757D",
    lineHeight: 24,
  },
});
export default WorkerHomeScreen;
