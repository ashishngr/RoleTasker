import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetAllTasks } from "../api/apiMutations";

type Task = {
  id: string;
  title: string;
  description: string;
  owner: string;
  assignees: string[];
  priority: "High" | "Medium" | "Low";
  status: "Done" | "In Progress" | "Backlog" | "Archived";
  createdAt: string; // Assume ISO date string
};

const TaskList: React.FC = () => {

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState<string | null>(null);

  const [isSortByModalVisible, setSortByModalVisible] = useState(false);
  const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);
  const [isStatusModalVisible, setStatusModalVisible] = useState(false);
  const [isDayModalVisible, setDayModalVisible] = useState(false);

  const isAnyFilterSelected = sortBy || priorityFilter || statusFilter || dayFilter; 



  const handleApplyFilters = () => {
    
    console.log("Filters applied with parameters:", { sortBy, priorityFilter, statusFilter, dayFilter });
  };

  const handleClearFilters = () => {
    setSortBy(null);
    setPriorityFilter(null);
    setStatusFilter(null);
    setDayFilter(null);
    refetch();
    console.log("Filters cleared");
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <Text style={styles.taskDetails}>Owner: {item.owner}</Text>
      <Text style={styles.taskDetails}>Assignees: {item.assignees.join(", ")}</Text>
      <Text style={[styles.taskDetails, { color: getPriorityColor(item.priority) }]}>
        Priority: {item.priority}
      </Text>
      <Text style={[styles.taskDetails, { color: getStatusColor(item.status) }]}>
        Status: {item.status}
      </Text>
    </View>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#FF6B6B";
      case "Medium":
        return "#FFD93D";
      case "Low":
        return "#4CAF50";
      default:
        return "#888";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "#4CAF50";
      case "In Progress":
        return "#FFD93D";
      case "Backlog":
        return "#FF6B6B";
      case "Archived":
        return "#888";
      default:
        return "#666";
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter Tasks</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {/* Sort By Filter */}
          <TouchableOpacity
            style={[styles.filterButton, sortBy === "latest" && styles.activeFilterButton]}
            onPress={() => setSortByModalVisible(!isSortByModalVisible)}
          >
            <Text style={styles.filterButtonText}>Sort By: {sortBy || "Select"}</Text>
          </TouchableOpacity>

          {/* Priority Filter */}
          <TouchableOpacity
            style={[styles.filterButton, priorityFilter && styles.activeFilterButton]}
            onPress={() => setPriorityModalVisible(!isPriorityModalVisible)}
          >
            <Text style={styles.filterButtonText}>Priority: {priorityFilter || "Select"}</Text>
          </TouchableOpacity>

          {/* Status Filter */}
          <TouchableOpacity
            style={[styles.filterButton, statusFilter && styles.activeFilterButton]}
            onPress={() => setStatusModalVisible(!isStatusModalVisible)}
          >
            <Text style={styles.filterButtonText}>Status: {statusFilter || "Select"}</Text>
          </TouchableOpacity>

          {/* Day Filter */}
          <TouchableOpacity
            style={[styles.filterButton, dayFilter && styles.activeFilterButton]}
            onPress={() => setDayModalVisible(!isDayModalVisible)}
          >
            <Text style={styles.filterButtonText}>Day: {dayFilter || "All"}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Apply & Clear Filters */}
        <View style={styles.filterActions}>
          <TouchableOpacity style={[styles.applyButton, !isAnyFilterSelected && styles.disabledButton]} onPress={handleApplyFilters} disabled={!isAnyFilterSelected}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Modals for filters */}
      <Modal visible={isSortByModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setSortByModalVisible(false)}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => { setSortBy("latest"); setSortByModalVisible(false); }}>
            <Text style={styles.modalItem}>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSortBy("oldest"); setSortByModalVisible(false); }}>
            <Text style={styles.modalItem}>Oldest</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isPriorityModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setPriorityModalVisible(false)}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          {["High", "Medium", "Low"].map((priority) => (
            <TouchableOpacity key={priority} onPress={() => { setPriorityFilter(priority); setPriorityModalVisible(false); }}>
              <Text style={styles.modalItem}>{priority}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <Modal visible={isStatusModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          {["Done", "In Progress", "Backlog", "Archived"].map((status) => (
            <TouchableOpacity key={status} onPress={() => { setStatusFilter(status); setStatusModalVisible(false); }}>
              <Text style={styles.modalItem}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <Modal visible={isDayModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setDayModalVisible(false)}>
          <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          {["Today", "This Week", "This Month", "All"].map((day) => (
            <TouchableOpacity key={day} onPress={() => { setDayFilter(day); setDayModalVisible(false); }}>
              <Text style={styles.modalItem}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4B9CD3",
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 5,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: "#4B9CD3",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  filterActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  applyButton: {
    backgroundColor: "#4B9CD3",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  clearButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  clearButtonText: {
    color: "#333",
    fontSize: 14,
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  taskDetails: {
    fontSize: 12,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
});

export default TaskList;
