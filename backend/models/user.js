const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: ["Admin", "Assigner", "Worker"],
      default: ["Worker"], // Default role if none specified
      required: true,
    },
    permissions: {
      canCreateTasks: { type: Boolean, default: false },
      canAssignTasks: { type: Boolean, default: false },
      canViewAllTasks: { type: Boolean, default: false },
      canUpdateTaskStatus: { type: Boolean, default: false },
      canAddNotes: { type: Boolean, default: false },
    },
  },
  {
    collection: "user",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
UserSchema.pre("save", async function (next) {
  // Only set permissions if this is a new document
  if (this.isNew) {
    this.permissions = {
      canCreateTasks: false,
      canAssignTasks: false,
      canViewAllTasks: false,
      canUpdateTaskStatus: false,
      canAddNotes: false,
    };

    if (this.roles.includes("Admin")) {
      this.permissions.canCreateTasks = true;
      this.permissions.canAssignTasks = true;
      this.permissions.canViewAllTasks = true;
      this.permissions.canUpdateTaskStatus = true;
      this.permissions.canAddNotes = true;
    }
    if (this.roles.includes("Assigner")) {
      this.permissions.canCreateTasks = true;
      this.permissions.canAssignTasks = true;
    }
    if (this.roles.includes("Worker")) {
      this.permissions.canUpdateTaskStatus = true;
      this.permissions.canAddNotes = true;
    }
  }

  // Only hash the password if it's new or has been modified
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }

  next();
});
// Method to compare password for authentication
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", UserSchema)
module.exports = {
    User
}