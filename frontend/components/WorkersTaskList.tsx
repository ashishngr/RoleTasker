import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useGetAllWorkers } from '../api/apiMutations';
import { getAllWorkersTasks, statusPayload } from '../api/api';
import { useAddComment } from '../api/apiMutations';
import CommentModal from './CommentModal';
import TaskInformationModal from './TaskInformationModal';
import { getTaskWithComment } from '../api/api';
import { useChangeStatus } from '../api/apiMutations';


type Task = {
    id: string;
    title: string;
    description: string;
    ownerName: string;
    assignees: string[];
    priority: 'High' | 'Medium' | 'Low';
    status: 'Done' | 'In Progress' | 'Backlog' | 'Archived';
    createdAt: string;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const WorkersTaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [dayFilter, setDayFilter] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>(""); 

    const [isSortByModalVisible, setSortByModalVisible] = useState(false);
    const [isPriorityModalVisible, setPriorityModalVisible] = useState(false);
    const [isStatusModalVisible, setStatusModalVisible] = useState(false);
    const [isDayModalVisible, setDayModalVisible] = useState(false);


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null); 

    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isTaskInfoModalVisible, setTaskInfoModalVisible] = useState<boolean>(false); 
    const [taskInfo, setTaskInfo] = useState<any | null>(null); 

    const {mutate : addComment} = useAddComment(); 
    const { mutate: updateTaskStatus } = useChangeStatus();

    const openTaskInfoMadal = async(taskId : string) =>{
        try {
            const response = await getTaskWithComment({ taskId });
            console.log("Task info fetched successfully: ", response);
    
            if (response) {
                setTaskInfo(response);
                setTaskInfoModalVisible(true); // Open modal only after data is ready
            } else {
                console.error('No task information returned.');
            }
        } catch (error) {
            console.error('Error fetching task information:', error);
        }
    }
    const closeTaskInfoModal = () => {
        setTaskInfoModalVisible(false);
        setTaskInfo(null);
    };


    const openCommentModal = (taskId: string) => {
        setSelectedTaskId(taskId);
        setModalVisible(true);
    };
    const closeCommentModal = () =>{
        setModalVisible(false);
    }
    
    const handleAddComment = (comment: string) => {
        console.log(`Adding comment to task ${selectedTaskId}: ${comment}`);
        // Here, make an API call or update the state to save the comment
        const payload = {
            taskId : selectedTaskId, 
            content : comment
        }; 
        addComment(payload, {
            onSuccess : (newComment) => {
                console.log("New Comment", newComment)
                setModalVisible(false);
            }, 
            onError : (error)=>{
                console.error("Error creating task:", error);
            }
        })
    };



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
            const response = await getAllWorkersTasks(activeFilters);
            console.log("---------------Response of workers taks list-------------------", response)
            setTasks(response?.data);
            console.log("Response of tasks((((((((((((((((()))))))))))))))))))))", response?.data)
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [sortBy, priorityFilter, statusFilter, dayFilter]);

    const handleSearch = async (search: string) => {
        console.log("&&&&&&&&&&{{{{{{{********************************************************}}}}}}}}}}}}}}", search)
        setSearchText(search);
        await fetchTasks(searchText);
    };

    const resetAllFilters = () => {
        setSortBy(null);
        setPriorityFilter(null);
        setStatusFilter(null);
        setDayFilter(null);
    };
    const handleStatusChange = (taskId: string, newStatus: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
        console.log(`Status for task --------------->>>>>>>>>>>>><<<<<<<<<<<<---------------${taskId} updated to: ${newStatus}`);
        // Add any additional logic here (e.g., API call to save updated status)
        const payload :statusPayload = {
            taskId : taskId, 
            status : newStatus
        }; 
        console.log("Payload-->+++++++++", payload)

        updateTaskStatus(payload, {
            onSuccess: () => {
                console.log(`Status for task ${taskId} successfully updated to: ${newStatus}`);
                fetchTasks();
            },
            onError: (error) => {
                console.error(`Error updating task ${taskId} status:`, error);
                // Rollback the optimistic update in case of an error
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId ? { ...task, status: task.status } : task
                    )
                );
            },
        }); 

    };


    const renderTaskItem = ({ item }: { item: Task }) => {
        return (
            <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={styles.taskDetails}>Owner: {item.ownerName}</Text>
                <Text style={styles.taskDetails}>Assignees: {item.assignees.map(assignee => assignee?.email).join(', ')}</Text>
                <Text style={[styles.taskDetails, { color: getPriorityColor(item.priority) }]}>
                    Priority: {item.priority}
                </Text>
                <View style={styles.statusPickerContainer}>
                    <Text style={styles.taskDetails}>Status:</Text>
                    <Picker
                        selectedValue={item.status}
                        onValueChange={(value: string) => handleStatusChange(item._id, value)}
                        style={styles.statusPicker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Done" value="Done" />
                        <Picker.Item label="In Progress" value="In Progress" />
                        <Picker.Item label="Backlog" value="Backlog" />
                        <Picker.Item label="Archived" value="Archived" />
                    </Picker>
                </View>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => openTaskInfoMadal(item._id)}>
                        <Ionicons name="eye" size={24} color="#007BFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openCommentModal(item._id)}>
                        <Ionicons name="chatbubble-outline" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>
               
            </View>
        )
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return '#FF6B6B';
            case 'Medium':
                return '#FFD93D';
            case 'Low':
                return '#4CAF50';
            default:
                return '#888';
        }
    };
    useEffect(() => {
        console.log("Task IDs::::::::::::::::::::::::", tasks.map(task => task._id));
    }, [tasks]);

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
                <Text style={styles.filterTitle}>Apply Filters</Text>
                {(sortBy || priorityFilter || statusFilter || dayFilter) && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetAllFilters}>
                        <Text style={styles.resetButtonText}>Reset All</Text>
                    </TouchableOpacity>
                )}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={[styles.filterButton, sortBy && styles.activeFilterButton]} onPress={() => setSortByModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Sort By: {sortBy || 'Select'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, priorityFilter && styles.activeFilterButton]} onPress={() => setPriorityModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Priority: {priorityFilter || 'Select'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, statusFilter && styles.activeFilterButton]} onPress={() => setStatusModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Status: {statusFilter || 'Select'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.filterButton, dayFilter && styles.activeFilterButton]} onPress={() => setDayModalVisible(true)}>
                        <Text style={styles.filterButtonText}>Day: {dayFilter || 'All'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Task List */}
            <View style={{ flex: 1 }}>
            {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
    ) : error ? (
        <Text>Error fetching tasks: {error.message}</Text>
    ) : tasks.length === 0 ? (
        <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>You currently have no tasks assigned to you.</Text>
        </View>
    ) : (
        <FlatList 
            data={tasks} 
            renderItem={renderTaskItem} 
            keyExtractor={(item) => item.id} 
            style={styles.taskList} 
            contentContainerStyle={{ paddingBottom: 80 }} 
        />
    )}
            </View>

            {/* Sort By Modal */}
            <Modal visible={isSortByModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setSortByModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setSortBy('latest'); setSortByModalVisible(false); }}><Text style={styles.modalItem}>Latest</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setSortBy('oldest'); setSortByModalVisible(false); }}><Text style={styles.modalItem}>Oldest</Text></TouchableOpacity>
                </View>
            </Modal>

            {/* Priority Modal */}
            <Modal visible={isPriorityModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setPriorityModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setPriorityFilter('High'); setPriorityModalVisible(false); }}><Text style={styles.modalItem}>High</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setPriorityFilter('Medium'); setPriorityModalVisible(false); }}><Text style={styles.modalItem}>Medium</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setPriorityFilter('Low'); setPriorityModalVisible(false); }}><Text style={styles.modalItem}>Low</Text></TouchableOpacity>
                </View>
            </Modal>

            {/* Status Modal */}
            <Modal visible={isStatusModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setStatusFilter('Done'); setStatusModalVisible(false); }}><Text style={styles.modalItem}>Done</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setStatusFilter('In Progress'); setStatusModalVisible(false); }}><Text style={styles.modalItem}>In Progress</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setStatusFilter('Backlog'); setStatusModalVisible(false); }}><Text style={styles.modalItem}>Backlog</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setStatusFilter('Archived'); setStatusModalVisible(false); }}><Text style={styles.modalItem}>Archived</Text></TouchableOpacity>
                </View>
            </Modal>

            {/* Day Modal */}
            <Modal visible={isDayModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setDayModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => { setDayFilter('Today'); setDayModalVisible(false); }}><Text style={styles.modalItem}>Today</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setDayFilter('This Week'); setDayModalVisible(false); }}><Text style={styles.modalItem}>This Week</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setDayFilter('All'); setDayModalVisible(false); }}><Text style={styles.modalItem}>All</Text></TouchableOpacity>
                </View>
            </Modal>

            <CommentModal
                    visible={isModalVisible}
                    onClose={closeCommentModal}
                    onCreateComment={handleAddComment}
            />

            <TaskInformationModal
                isVisible={isTaskInfoModalVisible}
                onClose={closeTaskInfoModal}
                task={taskInfo}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F2' },
    taskCard: { backgroundColor: '#FFFFFF', padding: 16, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, elevation: 2 },
    taskTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    taskDescription: { fontSize: 14, color: '#666666', marginBottom: 8 },
    taskDetails: { fontSize: 12, color: '#333333' },
    iconsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, alignItems: 'flex-end', gap: 8 },
    filterContainer: { padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
    filterTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    resetButton: { marginLeft: 'auto' },
    resetButtonText: { color: '#007BFF' },
    filterButton: { backgroundColor: '#E0E0E0', padding: 8, borderRadius: 8, marginRight: 8 },
    activeFilterButton: { backgroundColor: '#007BFF' },
    filterButtonText: { color: '#FFFFFF' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContainer: { position: 'absolute', top: '50%', left: '10%', right: '10%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8 },
    modalItem: { paddingVertical: 8, fontSize: 16, textAlign: 'center' },
    taskList: { paddingTop: 16 },
    statusPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusPicker: {
        width: 120,
        height: 50,
        backgroundColor: '#f0f0f0',
        color: '#333',
        overflow: 'hidden',
        marginLeft: 8,
        paddingHorizontal: 2,
        borderRadius: 20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    noTasksContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTasksText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
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
});

export default WorkersTaskList;
