// screens/AssignerHomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const AssignerHomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
    {/* Welcome Section */}
    <View style={styles.welcomeSection}>
      <Ionicons name="information-circle-outline" size={80} color="#4B9CD3" style={styles.icon} />
      <Text style={styles.title}>Welcome to RoleTasker!</Text>
      <Text style={styles.subtitle}>Empowering you to manage and delegate tasks effortlessly.</Text>
    </View>

    {/* About the Application */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>About RoleTasker</Text>
      <Text style={styles.sectionContent}>
        RoleTasker is a task management platform designed to streamline workflow between Admins, Assigners, and Workers. 
        With RoleTasker, you can easily assign tasks, track progress, and foster collaboration, all within a user-friendly 
        interface tailored to your specific role.
      </Text>
    </View>

    {/* Assigner Role Information */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Your Role as an Assigner</Text>
      <Text style={styles.sectionContent}>
        As an Assigner, you’re responsible for creating and assigning tasks to workers. You can manage and track task 
        statuses, send notifications, and ensure tasks are completed on time. Your role is crucial in keeping the team 
        organized and focused on their responsibilities.
      </Text>
    </View>

    {/* How Assigner Can Use the App */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>How to Use RoleTasker as an Assigner</Text>
      <Text style={styles.sectionContent}>
        1. Navigate to the "Tasks" section to create and assign tasks to specific workers.{'\n'}
        2. Use the "Notifications" feature to keep workers updated on any task changes.{'\n'}
        3. View the "Reports" section for task completion rates and worker performance.{'\n'}
        4. Communicate efficiently by using the "Messages" feature to keep everyone informed.
      </Text>
    </View>
  </ScrollView>
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

export default AssignerHomeScreen;
