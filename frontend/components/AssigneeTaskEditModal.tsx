import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { useGetAllWorkers, useEditTask } from "../api/apiMutations";

type Worker = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AssigneeTaskEditModalProps = {
  visible: boolean;
  task: any;
  onClose: () => void;
  onSave: (task: any) => void;
};


const AssigneeTaskEditModal: React.FC<AssigneeTaskEditModalProps> = ({
  visible,
  task,
  onClose,
  onSave,
}) => {
  const [editedTask, setEditedTask] = useState(task);
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);  
  const [deadline, setDeadline] = useState<Date | null>(task?.deadline || null);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); 

  const initialTask = useRef(task);

  const { mutate: fetchWorkers, data: workersData, isLoading } = useGetAllWorkers();
  const { mutate: editTask, isLoading: isEditing } = useEditTask();


  useEffect(() => {
    if (visible) {
      fetchWorkers();
    }
  }, [visible]);

  useEffect(() => {
    if (workersData && Array.isArray(workersData.data)) {
      setWorkerList(workersData.data);
    }
  }, [workersData]);

  useEffect(() => {
    if (task && task.assignees) {
      const defaultWorkers = task.assignees.map((assignee: any) => assignee.email);
      setSelectedWorkers(defaultWorkers);
    } 
    setDeadline(task.deadline);
    setEditedTask(task); 
    initialTask.current = task;
  }, [task]); 

  const validateForm = () => {
    const isTitleEmpty = !editedTask.title?.trim();
    const isDescriptionEmpty = !editedTask.description?.trim();
    const areWorkersSelected = selectedWorkers.length > 0;

    // Disable the save button if any required field is empty or no worker is selected
    return !(isTitleEmpty || isDescriptionEmpty || !areWorkersSelected);
  };
  useEffect(() => {
    setIsSaveDisabled(!validateForm());
  }, [editedTask, selectedWorkers]);
  
  const handleSave = () => {
    const updatedFields: Record<string, any> = {}; 

    const initialWorkersEmails = task.assignees.map((assignee: any) => assignee.email);
    if (JSON.stringify(initialWorkersEmails.sort()) !== JSON.stringify(selectedWorkers.sort())) {
        updatedFields.assignees = selectedWorkers;
    }

    // Only include fields in the payload that have changed
    if (editedTask.title !== task.title) updatedFields.title = editedTask.title;
    if (editedTask.description !== task.description)
      updatedFields.description = editedTask.description;
    if (editedTask.priority !== task.priority) updatedFields.priority = editedTask.priority;
    if (editedTask.status !== task.status) updatedFields.status = editedTask.status;
    if (deadline !== task.deadline) updatedFields.deadline = deadline;
    editTask(
      {
        taskId: editedTask._id,
        ...updatedFields, // Pass only the updated fields
      },
      {
        onSuccess: () => {
          console.log("Task successfully updated");
          onClose();
        },
        onError: (error) => {
          console.error("Error editing task: ", error);
          alert("Failed to update task. Please try again later.");
        },
      }
    )
  };

  const handleChange = (field: string, value: any) => {
    setEditedTask((prevTask: any) => ({
      ...prevTask,
      [field]: value,
    }));
  };



  useEffect(() => {
    console.log("task=====================================> ", task)
  }, [])

  const handleWorkerChange = (selectedWorker: string) => {
    setSelectedWorkers((prevSelectedWorkers) =>
      prevSelectedWorkers.includes(selectedWorker)
        ? prevSelectedWorkers.filter((worker) => worker !== selectedWorker) // Remove if already selected
        : [...prevSelectedWorkers, selectedWorker] // Add if not selected
    );
  };

  const handleDeadlineChange = (event: any, selectedDate?: Date) => {
    setShowDeadlinePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#FF3E4D" />
            </TouchableOpacity>
          </View>

          {/* Task Title */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              value={editedTask.title}
              placeholder="Enter task title"
              onChangeText={(text) =>
                handleChange("title", text)
              }
            />
          </View>

          {/* Task Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              value={editedTask.description}
              placeholder="Enter task description"
              onChangeText={(text) =>
                handleChange("description", text)
              }
            />
          </View>
          {/* Deadline */} 
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Deadline</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDeadlinePicker(true)}
            >
              <Text style={styles.dateText}>
                {deadline ? new Date(deadline).toLocaleDateString() : "No Deadline Provided"}
              </Text>
            </TouchableOpacity>
            {showDeadlinePicker && (
              <DateTimePicker
                value={editTask.deadline || new Date()}
                mode="date"
                display="default"
                onChange={handleDeadlineChange}
              />
            )}
          </View>
          {/* Workers */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Workers</Text>
            <View style={styles.workerGridContainer}>
              {workerList.map((worker) => (
                <TouchableOpacity
                  key={worker._id}
                  style={[
                    styles.workerChip,
                    selectedWorkers.includes(worker.email) && styles.workerChipSelected,
                  ]}
                  onPress={() => handleWorkerChange(worker.email)}
                >
                  <Text style={styles.workerChipText}>
                    {worker.firstName} {worker.lastName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Assignees Dropdown */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Assignee</Text>
            <Picker
              selectedValue={editedTask.assignees[0]}
              style={styles.picker}
              onValueChange={handleAssigneeChange}
            >
              {assigneesList.map((assignee, index) => (
                <Picker.Item
                  key={index}
                  label={assignee}
                  value={assignee}
                />
              ))}
            </Picker>
          </View> */}

          {/* Priority Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Priority</Text>
            <Picker
              selectedValue={editedTask.priority}
              style={styles.picker}
              onValueChange={(value) =>
                handleChange("priority", value)
              }
            >
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>

          {/* Status Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Status</Text>
            <Picker
              selectedValue={editedTask.status}
              style={styles.picker}
              onValueChange={(value) =>
                handleChange("status", value)
              }
            >
              <Picker.Item label="Done" value="Done" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Backlog" value="Backlog" />
              <Picker.Item label="Archived" value="Archived" />
            </Picker>
          </View>

          {/* Save and Cancel Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.saveButton, isSaveDisabled && { backgroundColor: "#ddd" }]}
              onPress={handleSave}
              disabled={isSaveDisabled} 
            >
              <MaterialIcons
                name="save"
                size={20}
                color="white"
              />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color="white"
              />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#F7F8FA",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  picker: {
    backgroundColor: "#F7F8FA",
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  pickerContainer: {
    marginBottom: 15,
    width: "100%",
  },
  workerGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxHeight: 150, // Set a fixed height for the container
    overflow: "scroll", // Make the container scrollable
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    padding: 5,
  },
  workerChip: {
    padding: 10,
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    minWidth: 80, // Ensure all chips have a minimum width
    alignItems: "center",
    justifyContent: "center",
  },
  workerChipSelected: {
    backgroundColor: "#4caf50",
  },
  workerChipText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});

export default AssigneeTaskEditModal;
