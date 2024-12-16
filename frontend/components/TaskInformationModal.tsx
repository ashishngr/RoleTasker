import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

interface Assignee {
  userId: string;
  email: string;
  _id: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskInformationModalProps {
  isVisible: boolean;
  onClose: () => void;
  task: {
    _id: string;
    title: string;
    description: string;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    assignees: Assignee[];
    priority: string;
    status: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    comments: Comment[];
  };
}

const TaskInformationModal: React.FC<TaskInformationModalProps> = ({
  isVisible,
  onClose,
  task,
}) => {
  if (!task) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>Task Details</Text>

            {/* Task Info */}
            <Text style={styles.label}>Title:</Text>
            <Text style={styles.value}>{task.title}</Text>

            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{task.description}</Text>

            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.value}>{task.priority}</Text>

            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{task.status}</Text>

            <Text style={styles.label}>Created At:</Text>
            <Text style={styles.value}>{new Date(task.createdAt).toLocaleString()}</Text>

            <Text style={styles.label}>Updated At:</Text>
            <Text style={styles.value}>{new Date(task.updatedAt).toLocaleString()}</Text>

            {/* Owner Info */}
            <Text style={styles.sectionTitle}>Owner Information</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{task.ownerName}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{task.ownerEmail}</Text>

            {/* Assignees */}
            <Text style={styles.sectionTitle}>Assignees</Text>
            {task.assignees.length > 0 ? (
              task.assignees.map((assignee) => (
                <View key={assignee._id} style={styles.assigneeContainer}>
                  <Text style={styles.value}>- {assignee.email}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.value}>No assignees.</Text>
            )}

            {/* Comments */}
            <Text style={styles.sectionTitle}>Comments</Text>
            {task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <View key={comment._id} style={styles.commentContainer}>
                  <Text style={styles.commentUser}>
                    {comment.userName} ({new Date(comment.createdAt).toLocaleString()}):
                  </Text>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.value}>No comments.</Text>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
  },
  assigneeContainer: {
    marginBottom: 5,
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentContent: {
    fontSize: 14,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TaskInformationModal;
