const { User } = require("../models/user");
const { Task } = require("../models/task");

const AdminController = module.exports;

AdminController.getAdminHomePageAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminUser = await User.findById(userId);
    if (!adminUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    console.log("user", userId);
    const users = await User.find();
    const activeUsers = users.length;

    const workers = users.filter((user) => user.roles[0] === "Worker").length;
    const assigners = users.filter(
      (user) => user.roles[0] === "Assigner"
    ).length;

    const tasks = await Task.find();
    const totalTasks = tasks.length;

    const doneTasks = tasks.filter((task) => task.status === "Done").length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const currentDate = new Date();
    const overdueTasks = tasks.filter(
      (task) =>
        task.deadline &&
        new Date(task.deadline) < currentDate &&
        task.status !== "Done"
    ).length;

    res.status(200).json({
      activeUsers,
      workers,
      assigners,
      totalTasks,
      doneTasks,
      inProgressTasks,
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
AdminController.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminUser = await User.findById(userId);
    if (!adminUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const {
      search, // Matches title or description
      ownerEmail, // Filter by owner email
      assigneeEmail, // Filter by assignee email
      status, // Filter by task status
      priority, // Filter by task priority
      sortBy = "createdAt", // Sort field
      sortOrder = "desc", // Sort order (asc or desc)
      createdAt,
    } = req.query;

    console.log("Req query for admin side", req.query);
    const pipeline = [];
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      });
    }
    if (ownerEmail) {
      pipeline.push({
        $match: { ownerEmail: ownerEmail },
      });
    }
    if (assigneeEmail) {
      pipeline.push({
        $match: { "assignees.email": assigneeEmail },
      });
    }
    if (status) {
      if (
        !["Done", "In Progress", "Backlog", "Archived", "Deleted"].includes(
          status
        )
      ) {
        return res.status(400).json({ message: "Invalid status value." });
      }
      pipeline.push({
        $match: { status: status },
      });
    }
    if (priority) {
      if (!["High", "Medium", "Low"].includes(priority)) {
        return res.status(400).json({ message: "Invalid priority value." });
      }
      pipeline.push({
        $match: { priority: priority },
      });
    }
    if (sortBy) {
      let field = "createdAt"; // Default field to sort
      let order = -1; // Default to descending order

      if (sortBy === "oldest") {
        field = "createdAt";
        order = 1; // Ascending order for oldest
      } else if (sortBy === "latest") {
        field = "createdAt";
        order = -1; // Descending order for latest
      } else {
        field = sortBy; // Use custom field provided in query
        order = sortOrder === "asc" ? 1 : -1;
      }

      pipeline.push({
        $sort: {
          [field]: order,
        },
      });
    }
    const currentDate = new Date();
    if (createdAt === "Today") {
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
      pipeline.push({
        $match: {
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        },
      });
    } else if (createdAt === "This Week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      pipeline.push({
        $match: {
          createdAt: { $gte: startOfWeek, $lt: endOfWeek },
        },
      });
    } else if (createdAt === "This Month") {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);
      pipeline.push({
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      });
    }
    const tasks = await Task.aggregate(pipeline);
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error occurred while creating task:", error);
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
};
AdminController.staticAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminUser = await User.findById(userId);
    if (!adminUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const users = await User.find();
    const activeUsers = users.length;

    const worker = users.filter((user) => user.roles[0] === "Worker").length;
    const assigners = users.filter(
      (user) => user.roles[0] === "Assigner"
    ).length;
    const tasks = await Task.find();
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((task) => task.status === "Done").length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const deletedTasks = tasks.filter(
      (task) => task.status === "Deleted"
    ).length;
    const currentDate = new Date();
    const overdueTasks = tasks.filter(
      (task) =>
        task.deadline &&
        new Date(task.deadline) < currentDate &&
        task.status !== "Done"
    ).length;
    const archivedTask = tasks.filter(
      (task) => task.isArchived === true
    ).length;
    res.status(200).json({
      activeUsers,
      worker,
      assigners,
      totalTasks,
      doneTasks,
      inProgressTasks,
      deletedTasks,
      overdueTasks,
      archivedTask,
    });
  } catch (error) {
    console.error("Error occurred while creating task:", error);
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
};
AdminController.getPerformanceMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminUser = await User.findById(userId);
    if (!adminUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const performanceData = {};
    const tasks = await Task.find();

    // Process each task to calculate metrics
    tasks.forEach((task) => {
      task.assignees.forEach((assignee) => {
        const workerId = assignee.userId;
        if (!performanceData[workerId]) {
          performanceData[workerId] = {
            userId: workerId,
            email: assignee.email,
            totalTasks: 0,
            doneTasks: 0,
            inProgressTasks: 0,
          };
        }
        performanceData[workerId].totalTasks += 1;
        if (task.status === "Done") {
          performanceData[workerId].doneTasks += 1;
        } else if (task.status === "In Progress") {
          performanceData[workerId].inProgressTasks += 1;
        }
      });
    });
    // Calculate task completion percentage for each worker
    const performanceList = Object.values(performanceData).map((worker) => {
      worker.taskPercentage =
        worker.totalTasks > 0
          ? ((worker.doneTasks / worker.totalTasks) * 100).toFixed(2)
          : 0;
      return worker;
    });

    // Identify the best and worst performers
    const sortedPerformance = performanceList.sort(
      (a, b) => b.taskPercentage - a.taskPercentage
    );
    const bestPerformer = sortedPerformance[0] || null; // Worker with the highest taskPercentage
    const worstPerformer =
      sortedPerformance[sortedPerformance.length - 1] || null; // Worker with the lowest taskPercentage

    // Respond with the data
    res.status(200).json({
      bestPerformer,
      worstPerformer,
    });
  } catch (error) {
    console.error("Error occurred while creating task:", error);
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
};
AdminController.getAnalyticsData = async (req, res) => {
  try {
    const userId = req.user.id;
    const adminUser = await User.findById(userId);
    if (!adminUser) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const analyticsData = await Task.aggregate([
      {
        $facet: {
          tasksByStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          tasksByPriority: [
            {
              $group: {
                _id: "$priority",
                count: { $sum: 1 },
              },
            },
          ],
          tasksByWorker: [
            { $unwind: "$assignees" },
            {
              $group: {
                _id: "$assignees.userId",
                email: { $first: "$assignees.email" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                userId: "$_id",
                email: 1,
                count: 1,
                _id: 0,
              },
            },
          ],
          tasksByCreator: [
            {
              $group: {
                _id: "$ownerId",
                ownerName: { $first: "$ownerName" },
                ownerEmail: { $first: "$ownerEmail" },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                userId: "$_id",
                ownerName: 1,
                ownerEmail: 1,
                count: 1,
                _id: 0,
              },
            },
          ],
          archivedTasks: [
            {
              $match: {
                isArchived: true,
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                count: { $ifNull: ["$count", 0] },
              },
            },
          ],
        },
      },
    ]);
    console.log("analyticsData", analyticsData);

    const archivedTaskCount =
      analyticsData[0].archivedTasks.length > 0
        ? analyticsData[0].archivedTasks[0].count
        : 0;

    res.status(200).json({
      tasksByStatus: analyticsData[0].tasksByStatus,
      tasksByPriority: analyticsData[0].tasksByPriority,
      tasksByWorker: analyticsData[0].tasksByWorker,
      tasksByCreator: analyticsData[0].tasksByCreator,
      archivedTasks: archivedTaskCount,
    });
  } catch (error) {
    console.error("Error occurred while creating task:", error);
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
};
