import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView, ActivityIndicator, Dimensions, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAllTasks } from "../api/api";
import AssigneeTaskEditModal from "./AssigneeTaskEditModal";

type Task = {
    id: string;
    title: string;
    description: string;
    ownerName: string;
    assignees: string[];
    priority: "High" | "Medium" | "Low";
    status: "Done" | "In Progress" | "Backlog" | "Archived";
    createdAt: string;
};
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dayFilter, setDayFilter] = useState<string | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Tasks filtered by search input
    const [searchText, setSearchText] = useState<string>(""); // Search input value

    const [isSortByModalVisible, setSortByModalVisible] = useState(false);
    const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);
    const [isStatusModalVisible, setStatusModalVisible] = useState(false);
    const [isDayModalVisible, setDayModalVisible] = useState(false);

    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setEditModalVisible(true);

    };

    const handleDeleteTask = (taskId: string) => {
        // Handle task deletion here (e.g., API call to delete task)
    };



    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTasks = async (searchQuery: string = "") => {
        setIsLoading(true);
        setError(null);

        const activeFilters: Record<string, string> = {};
        if (sortBy) activeFilters.sortBy = sortBy;
        if (priorityFilter) activeFilters.priority = priorityFilter;
        if (statusFilter) activeFilters.status = statusFilter;
        if (dayFilter) activeFilters.createdAt = dayFilter;
        if (searchQuery) activeFilters.search = searchQuery;

        try {
            const response = await getAllTasks(activeFilters);
            setTasks(response?.data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const closeEditTaskModal = () => {
        setEditModalVisible(flase);
        fetchTasks();
    }

    useEffect(() => {
        fetchTasks();
    }, [sortBy, priorityFilter, statusFilter, dayFilter]);

    const handleSearch = async (search: string) => {
        setSearchText(search);
        await fetchTasks(searchText);
    };



    const resetAllFilters = () => {
        setSortBy(null);
        setPriorityFilter(null);
        setStatusFilter(null);
        setDayFilter(null);
        setSearchText("");
        setFilteredTasks(tasks);
    };

    const renderTaskItem = useCallback(({ item }: { item: Task }) => {
        const isOverdue = new Date(item.deadline) < new Date();

        return (
            <View style={styles.taskCard}>
                <View style={styles.headerRow}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text
                        style={[
                            styles.deadline,
                            isOverdue ? styles.deadlineOverdue : styles.deadlineNormal,
                        ]}
                    >
                        {new Date(item.deadline).toLocaleDateString()}
                    </Text>
                </View>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskDetails}>Owner: {item.ownerName}</Text>
                <Text style={styles.taskDetails}>
                    Assignees: {item.assignees.map(assignee => assignee.email).join(' , ')}
                </Text>
                <Text
                    style={[styles.taskDetails, { color: getPriorityColor(item.priority) }]}
                >
                    Priority: {item.priority}
                </Text>
                <Text
                    style={[styles.taskDetails, { color: getStatusColor(item.status) }]}
                >
                    Status: {item.status}
                </Text>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => handleEditTask(item)}>
                        <Ionicons name="pencil" size={24} color="#007BFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Delete task', item.id)}>
                        <Ionicons name="trash-bin" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }, []);

    const getPriorityColor = useCallback((priority: string) => {
        switch (priority) {
            case "High": return "#FF6B6B";
            case "Medium": return "#FFD93D";
            case "Low": return "#4CAF50";
            default: return "#888";
        }
    }, []);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case "Done": return "#4CAF50";
            case "In Progress": return "#FFD93D";
            case "Backlog": return "#FF6B6B";
            case "Archived": return "#888";
            default: return "#666";
        }
    }, []);
    const handleSaveTask = (updatedTask: Task) => {
        // Handle saving the updated task here (e.g., API call to update task)
        console.log("Task saved--------------------::::::::::::::::::--------------------------->", updatedTask);
        // Update the task in the state

    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                value={searchText}
                onChangeText={handleSearch}
            />
            {/* Filter Section */}
            <View style={styles.filterContainer}>

                <Text style={styles.filterTitle}>Filter Tasks</Text>
                {(sortBy || priorityFilter || statusFilter || dayFilter) && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetAllFilters}>
                        <Text style={styles.resetButtonText}>Reset All</Text>
                    </TouchableOpacity>
                )}

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={[styles.filterButton, sortBy && styles.activeFilterButton]} onPress={() => setSortByModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Sort By: {sortBy || "Select"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, priorityFilter && styles.activeFilterButton]} onPress={() => setPriorityModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Priority: {priorityFilter || "Select"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, statusFilter && styles.activeFilterButton]} onPress={() => setStatusModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Status: {statusFilter || "Select"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, dayFilter && styles.activeFilterButton]} onPress={() => setDayModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Day: {dayFilter || "All"}</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>

            {/* Task List */}
            <View>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#007BFF" />
                ) : error ? (
                    <Text>Error fetching tasks: {error.message}</Text>
                ) : (
                    <FlatList data={tasks} renderItem={renderTaskItem} keyExtractor={(item) => item.id} style={styles.taskList} contentContainerStyle={{ paddingBottom: 80 }} />
                )}
                {selectedTask && (
                    <AssigneeTaskEditModal
                        visible={isEditModalVisible}
                        task={selectedTask}
                        onClose={() => setEditModalVisible(false)}
                        onSave={handleSaveTask}
                    />
                )}
            </View>


            {/* Sort By Modal */}
            <Modal visible={isSortByModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setSortByModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setSortBy("latest"); setSortByModalVisible(false); }}><Text style={styles.modalItem}>Latest</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setSortBy("oldest"); setSortByModalVisible(false); }}><Text style={styles.modalItem}>Oldest</Text></TouchableOpacity>
                </View>
            </Modal>

            {/* Priority Modal */}
            <Modal visible={isPriorityModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setPriorityModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setPriorityFilter("High"); setPriorityModalVisible(false); }}><Text style={styles.modalItem}>High</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setPriorityFilter("Medium"); setPriorityModalVisible(false); }}><Text style={styles.modalItem}>Medium</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setPriorityFilter("Low"); setPriorityModalVisible(false); }}><Text style={styles.modalItem}>Low</Text></TouchableOpacity>
                </View>
            </Modal>

            {/* Status Modal */}
            <Modal visible={isStatusModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setStatusFilter("Done"); setStatusModalVisible(false); }}><Text style={styles.modalItem}>Done</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setStatusFilter("In Progress"); setStatusModalVisible(false); }}><Text style={styles.modalItem}>In Progress</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setStatusFilter("Backlog"); setStatusModalVisible(false); }}><Text style={styles.modalItem}>Backlog</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setStatusFilter("Archived"); setStatusModalVisible(false); }}><Text style={styles.modalItem}>Archived</Text></TouchableOpacity>
                </View>
            </Modal>

            {/* Day Modal */}
            <Modal visible={isDayModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setDayModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setDayFilter("Today"); setDayModalVisible(false); }}><Text style={styles.modalItem}>Today</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setDayFilter("This Week"); setDayModalVisible(false); }}><Text style={styles.modalItem}>This Week</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setDayFilter("This Month"); setDayModalVisible(false); }}><Text style={styles.modalItem}>This Month</Text></TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20, marginBottom: 56 },
    filterContainer: { marginBottom: 20 },
    filterTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    filterButton: { backgroundColor: "#f1f1f1", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginRight: 10 },
    filterButtonText: { fontSize: 14, color: "#333" },
    activeFilterButton: { backgroundColor: "#007BFF" },
    resetButton: { backgroundColor: "#FF6B6B", borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, alignItems: "center", justifyContent: "center", marginBottom: 6 },
    resetButtonText: { fontSize: 20, color: "#fff", textAlign: "center" },
    taskList: { marginBottom: 20 },
    taskCard: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3 },
    taskTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
    taskDescription: { fontSize: 14, color: "#666", marginTop: 5 },
    taskDetails: { fontSize: 12, color: "#888", marginTop: 5 },
    modalOverlay: {
        position: "absolute",
        top: 0,
        bottom: 20,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContainer: {
        position: "absolute",
        top: screenHeight / 2 - 100, // Dynamically centered vertically
        left: screenWidth / 2 - 150, // Dynamically centered horizontally
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        width: 300,  // Optional: set a fixed width for the modal
    },
    modalItem: {
        fontSize: 16,
        color: "#333",
        paddingVertical: 8,
        paddingHorizontal: 20
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 10,
        paddingRight: 10,
        gap: 10
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        paddingHorizontal: 8, // Ensure padding does not squash the content
    },
    deadline: {
        padding: 4,
        borderRadius: 4,
        fontSize: 14,
    },
    deadlineNormal: {
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    deadlineOverdue: {
        backgroundColor: '#ffcccc',
        color: '#900',
    },
});

export default TaskList;
