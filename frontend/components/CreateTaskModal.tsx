import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useGetAllWorkers } from "../api/apiMutations";
import DateTimePicker from "@react-native-community/datetimepicker"; 


type CreateTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreateTask: (task: {
    title: string;
    description: string;
    assignees: string[];
    priority: string;
    status: string;
    deadline : string;
  }) => void;
};
type Worker = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ visible, onClose, onCreateTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [priority, setPriority] = useState("Select Priority");
  const [status, setStatus] = useState("Select Status");
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { mutate: fetchWorkers, data: workersData, isLoading } = useGetAllWorkers();

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

  const toggleAssignee = (email: string) => {
    setAssignees((prevAssignees) =>
      prevAssignees.includes(email)
        ? prevAssignees.filter((assignee) => assignee !== email) // Deselect if already selected
        : [...prevAssignees, email] // Add to selected if not already present
    );
  };

  const handleCreateTask = () => {
    const formattedDeadline = deadline ? deadline.toISOString().split("T")[0] : "";
    onCreateTask({ title, description, assignees, priority, status, deadline : formattedDeadline });
    onClose();
    setTitle("");
    setDescription("");
    setAssignees([""]);
    setPriority("Select Priority");
    setStatus("Select Status");
    setDeadline(undefined);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Task</Text>

          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          {/* Deadline Input */} 

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{deadline ? deadline.toDateString() : "Select Deadline"}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={deadline || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDeadline(selectedDate);
              }}
            />
          )}
          

          {/* Assignees Dropdown */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Assignees:</Text>
            {workerList.map((worker) => (
              <TouchableOpacity
                key={worker._id}
                style={[
                  styles.assigneeChip,
                  assignees.includes(worker.email) && styles.selectedAssigneeChip,
                ]}
                onPress={() => toggleAssignee(worker.email)}
              >
                <Text
                  style={[
                    styles.assigneeText,
                    assignees.includes(worker.email) && styles.selectedAssigneeText,
                  ]}
                >
                  {`${worker.firstName} ${worker.lastName}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority Dropdown */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => setPriority(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Priority" value="Select Priority" />
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>

          {/* Status Dropdown */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Status" value="Select Status" />
              <Picker.Item label="Done" value="Done" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Backlog" value="Backlog" />
              <Picker.Item label="Archived" value="Archived" />
            </Picker>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
              <Text style={styles.createButtonText}>Create Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B9CD3",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    marginBottom: 15,
    overflow: "hidden",
    padding: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  createButton: {
    backgroundColor: "#4B9CD3",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  createButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#888",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  assigneeChip: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  selectedAssigneeChip: {
    backgroundColor: "#4B9CD3",
  },
  assigneeText: {
    color: "#000",
  },
  selectedAssigneeText: {
    color: "#FFF",
  },
  selectedAssigneesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4B9CD3",
    padding: 5,
    borderRadius: 20,
    margin: 5,
  },
  selectedChipText: {
    color: "#FFF",
    marginRight: 5,
  },
  removeChipText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default CreateTaskModal;
