const { User } = require("../models/user");
const { Task } = require("../models/task");
const mongoose = require("mongoose");

const AssigneeController = module.exports;

AssigneeController.getAssigneHomepAgeInfo = async (req, res) => {
  try {
    //  TODO : extract information
    //  Number of Inprogress tasks, Number of complete tasks, number of overdue tasks
    //  List of tasks [only three] - Latest Tasks [Based on created At field]
    // Upcomming deadlines - List of tasks which are very closed to deadline
    // List of overdue deadlines - List of overdue tasks only two
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const tasks = await Task.find({ ownerId: userId });
    console.log("All tasks", tasks);
    const inProgressCount = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const doneCount = tasks.filter((task) => task.status === "Done").length;
    const overDueCount = tasks.filter(
      (task) => new Date(task.deadline) < new Date() && task.status !== "Done"
    ).length;

    console.log("Counts", inProgressCount, doneCount, overDueCount);

    const latestTasks = await Task.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title priority status _id deadline");
    const overdueTasks = await Task.find({
      ownerId: userId,
      deadline: { $lt: new Date() },
      status: { $ne: "Done" },
    })
      .sort({ deadline: -1 })
      .limit(2)
      .select("title priority  status _id deadline");
    res.status(200).json({
      counts: {
        inProgress: inProgressCount,
        done: doneCount,
        overdue: overDueCount,
      },
      latestTasks,
      overdueTasks,
    });
  } catch (error) {
    console.error("Error occurred while creating task:", error);
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
};
