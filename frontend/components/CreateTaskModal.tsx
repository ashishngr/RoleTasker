import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useGetAllWorkers } from "../api/apiMutations";

type CreateTaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreateTask: (task: {
    title: string;
    description: string;
    assignees: string;
    priority: string;
    status: string;
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
  const [assignees, setAssignees] = useState("");
  const [priority, setPriority] = useState("Select Priority");
  const [status, setStatus] = useState("Select Status");
  const [workerList, setWorkerList] = useState<Worker[]>([]); 

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

  const handleCreateTask = () => {
    onCreateTask({ title, description, assignees, priority, status });
    onClose();
    setTitle("");
    setDescription("");
    setAssignees("Select Assignee");
    setPriority("Select Priority");
    setStatus("Select Status");
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

          {/* Assignees Dropdown */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={assignees}
              onValueChange={(itemValue) => setAssignees(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Assignee" value="" />
              {!isLoading && workerList.map((worker) => (
                <Picker.Item
                  key={worker._id}
                  label={`${worker.firstName} ${worker.lastName} - ${worker.email}`}
                  value={worker.email}
                />
              ))}
            </Picker>
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
});

export default CreateTaskModal;
