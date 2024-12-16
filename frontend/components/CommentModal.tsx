import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

type CreateCommentModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreateComment: (comment: string) => void;
};

const CommentModal: React.FC<CreateCommentModalProps> = ({
  visible,
  onClose,
  onCreateComment,
}) => {
  const [comment, setComment] = useState("");

  const handleCreateComment = () => {
    if (comment.trim()) {
      onCreateComment(comment); 
      setComment("");
      onClose();
    } else {
      alert("Please enter a comment.");
    }
  };
  const handleModalClose = () => {
    setComment(""); 
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Comment</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateComment}>
              <Text style={styles.createButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleModalClose}>
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
    height: 120,
    textAlignVertical: "top",
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

export default CommentModal;

