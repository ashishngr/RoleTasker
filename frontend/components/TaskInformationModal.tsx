import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const TaskInformationModal = ({ isVisible, onClose, task }) => {
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{task.title || "Task Details"}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>✖</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Highlighted Info */}
            <View style={styles.highlightedInfo}>
              <Text style={styles.label}>Priority:</Text>
              <Text style={styles.value}>{task.priority || "N/A"}</Text>

              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{task.status || "N/A"}</Text>

              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>

            {/* Task Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.value}>{task.description || "No description provided."}</Text>

            {/* Owner Info */}
            <Text style={styles.sectionTitle}>Owner Information</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{task.ownerName || "N/A"}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{task.ownerEmail || "N/A"}</Text>

            {/* Assignees */}
            <Text style={styles.sectionTitle}>Assignees</Text>
            {task.assignees.length > 0 ? (
              task.assignees.map((assignee) => (
                <Text key={assignee._id} style={styles.value}>
                  - {assignee.email}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>No assignees assigned.</Text>
            )}

            {/* Comments */}
            <Text style={styles.sectionTitle}>Comments</Text>
            {task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <View key={comment._id} style={styles.commentContainer}>
                  <Text style={styles.commentUser}>
                    {comment.userName} (
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : "No date available"}
                    ):
                  </Text>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.value}>No comments yet.</Text>
            )}
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
    padding: 15,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeIcon: {
    fontSize: 20,
    color: "#ff5c5c",
  },
  highlightedInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
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
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
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
});

export default TaskInformationModal;
