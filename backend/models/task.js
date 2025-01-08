const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Task description cannot exceed 500 characters"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming a User model exists
      required: [true, "Owner ID is required"],
    },
    ownerName : {
      type : String, 
      required: true,
      maxlength : 36
    },
    ownerEmail: {
      type: String,
      required: [true, "Owner email is required"],
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    assignees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        email: {
          type: String,
          validate: {
            validator: function (email) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: (props) => `${props.value} is not a valid email!`,
          },
        },
      },
    ],
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: [true, "Priority level is required"],
    },
    status: {
      type: String,
      enum: ["Done", "In Progress", "Backlog", "Deleted"],
      default: "Backlog",
      required: [true, "Status is required"],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      required: false, // Optional for flexibility
      validate: {
        validator: function (date) {
          return date instanceof Date && !isNaN(date.getTime());
        },
        message: "Invalid date format for deadline.",
      },
    },
  },
  {
    collection: "task",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
const Task = mongoose.model("Task", TaskSchema);
module.exports = {
  Task
};
