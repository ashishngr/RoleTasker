const { User } = require("../models/user");
const { Task } = require("../models/task");
const { Comment } = require("../models/comment");
const mongoose = require("mongoose");

const WorkerController = module.exports;

WorkerController.getAllWorkers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const workers = await User.find({ roles: "Worker" }).select(
      "firstName lastName email"
    );
    res.status(200).json({
      success: true,
      data: workers,
    });
  } catch (error) {
    onsole.error("Error fetching workers:", error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workers",
      error: error.message,
    });
  }
};
//TODO : Get ALL Tasks assign to a specific worker
WorkerController.getSingleWorkerTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const { sortBy, priority, status, createdAt, search } = req.query;
    const matchConditions = {
      "assignees.userId": new mongoose.Types.ObjectId(userId),
    };
    if (priority) matchConditions.priority = priority;
    if (status) matchConditions.status = status;
    const currentDate = new Date();
    if (createdAt === "Today") {
      matchConditions.createdAt = {
        $gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Start of today
        $lt: new Date(currentDate.setHours(23, 59, 59, 999)), // End of today
      };
    } else if (createdAt === "This Week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      matchConditions.createdAt = {
        $gte: startOfWeek,
        $lt: endOfWeek,
      };
    } else if (createdAt === "This Month") {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);

      matchConditions.createdAt = {
        $gte: startOfMonth,
        $lt: endOfMonth,
      };
    }
    if (search) {
      matchConditions.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search in title
        { description: { $regex: search, $options: "i" } }, // Case-insensitive search in description
      ];
    }
    const sortOptions = { createdAt: -1 }; // Default to most recent first
    if (sortBy === "oldest") {
      sortOptions.createdAt = 1; // Sort by oldest first
    }
    const tasks = await Task.aggregate([
      { $match: matchConditions },
      { $sort: sortOptions },
    ]);
    console.log("Tasks of a worker", tasks);
    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: tasks,
      totalTasks: tasks.length,
    });
  } catch (error) {
    console.error("Error occurred while retrieving tasks:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the tasks.",
      details: error.message,
    });
  }
};
//TODO : Workers can Add comments
WorkerController.addComment = async (req, res) => {
  const userId = req.user.id;
  const { taskId, content } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }
  if (!taskId || !content) {
    return res
      .status(400)
      .json({ message: "Task ID and content are required" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ message: "No task found with this Id" });
    }
    const newComment = new Comment({
      taskId,
      userId,
      content,
      userName: `${user.firstName} ${user.lastName}`,
    });
    await newComment.save();
    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error occurred while retrieving tasks:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the tasks.",
      details: error.message,
    });
  }
};
//TODO : GET API to return task information including it's comments
WorkerController.getTaskInfo = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }
  try {
    const taskWithComments = await Task.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(taskId) }, // Match task by taskId
      },
      {
        $lookup: {
          from: "comment", // Comments collection
          localField: "_id", // Field in Task
          foreignField: "taskId", // Field in Comment
          as: "comments", // Alias for matched comments
        },
      },
      {
        $unwind: {
          path: "$comments", // Flatten comments if needed
          preserveNullAndEmptyArrays: true, // Include tasks without comments
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          ownerId: 1,
          ownerName: 1,
          ownerEmail: 1,
          assignees: 1,
          priority: 1,
          status: 1,
          isArchived: 1,
          createdAt: 1,
          updatedAt: 1,
          "comments._id": 1,
          "comments.content": 1,
          "comments.userId": 1,
          "comments.createdAt": 1,
          "comments.updatedAt": 1,
          "comments.userName": 1,
        },
      },
      {
        $group: {
          _id: "$_id", // Group by task ID
          title: { $first: "$title" },
          description: { $first: "$description" },
          ownerId: { $first: "$ownerId" },
          ownerName: { $first: "$ownerName" },
          ownerEmail: { $first: "$ownerEmail" },
          assignees: { $first: "$assignees" },
          priority: { $first: "$priority" },
          status: { $first: "$status" },
          isArchived: { $first: "$isArchived" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          comments: {
            $push: {
              _id: "$comments._id",
              content: "$comments.content",
              userId: "$comments.userId",
              userName: "$comments.userName",
              user: "$comments.user",
              createdAt: "$comments.createdAt",
              updatedAt: "$comments.updatedAt",
            },
          },
        },
      },
    ]);
    if (!taskWithComments || taskWithComments.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(taskWithComments[0]);
  } catch (error) {
    console.error("Error occurred while retrieving tasks:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the tasks.",
      details: error.message,
    });
  }
};
WorkerController.updateStatus = async (req, res) => {
  console.log("First------", req.body);
  const userId = req.user.id;
  const { taskId } = req.params;
  const { status } = req.body;
  const user = await User.findById(userId);
  console.log("Status------>", status);
  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }
  const validStatuses = ["Done", "In Progress", "Backlog", "Archived"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Check if the user is authorized (e.g., Creator, Assignee)
    const isAssignee = task.assignees.some(
      (assignee) => assignee.userId.toString() === userId.toString()
    );
    if (!isAssignee) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }
    task.status = status;
    await task.save();
    res.status(200).json({
      message: "Task status updated successfully.",
    });
  } catch (error) {
    console.error("Error occurred while retrieving tasks:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the tasks.",
      details: error.message,
    });
  }
};
WorkerController.getWorkerAnalytics = async (req, res) => {
  try {
    const userId = req.user.id; // Worker ID from the logged-in user

    // Find the worker in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const { filter } = req.query; // Example: Today, This Week, This Month, etc.

    // Determine the date range based on the filter
    const currentDate = new Date();
    let dateFilter = {};
    if (filter === "Today") {
      dateFilter = {
        $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
      };
    } else if (filter === "This Week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      dateFilter = {
        $gte: startOfWeek,
        $lt: endOfWeek,
      };
    } else if (filter === "This Month") {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);

      dateFilter = {
        $gte: startOfMonth,
        $lt: endOfMonth,
      };
    } else if (filter === "Last Six Months") {
      const sixMonthsAgo = new Date(currentDate);
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

      dateFilter = {
        $gte: sixMonthsAgo,
        $lt: currentDate,
      };
    } else if (filter === "This Year") {
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const endOfYear = new Date(currentDate.getFullYear() + 1, 0, 1);

      dateFilter = {
        $gte: startOfYear,
        $lt: endOfYear,
      };
    }

    // Build the match condition
    const matchConditions = {
      "assignees.userId": new mongoose.Types.ObjectId(userId),
    };

    if (filter && filter !== "All") {
      matchConditions.createdAt = dateFilter;
    }

    // Aggregation pipeline
    const analytics = await Task.aggregate([
      { $match: matchConditions },

      // Stage 1: Group data for tasks by status, priority, and assigner
      {
        $facet: {
          tasksByStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { status: "$_id", count: 1, _id: 0 } },
          ],

          tasksByPriority: [
            { $group: { _id: "$priority", count: { $sum: 1 } } },
            { $project: { priority: "$_id", count: 1, _id: 0 } },
          ],

          tasksOverTime: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                  day: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
            {
              $project: {
                _id: 0,
                count: 1,
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
          ],

          tasksByAssigner: [
            { $group: { _id: "$ownerName", count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    // Formatting the response
    const formattedAnalytics = {
      tasksByStatus: analytics[0]?.tasksByStatus || [],
      tasksByPriority: analytics[0]?.tasksByPriority || [],
      tasksOverTime: analytics[0]?.tasksOverTime || [],
      tasksByAssigner:
        analytics[0]?.tasksByAssigner?.map((item) => ({
          name: item._id,
          count: item.count,
        })) || [],
    };

    res.status(200).json({
      message: "Worker analytics retrieved successfully",
      data: formattedAnalytics,
    });
  } catch (error) {
    console.error("Error occurred while retrieving worker analytics:", error);
    res.status(500).json({
      message: "An error occurred while retrieving worker analytics.",
      details: error.message,
    });
  }
};
WorkerController.getHomePageInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const tasks = await Task.find({
      "assignees.userId": userId, // Match userId in the assignees array
    });
    const inProgressTaskCount = tasks.filter(
      (task) => task.status === "In Progress"
    ).length; 
    const doneTaskCount = tasks.filter(
      (task) => task.status === "Done"
    ).length; 
    const overdueTaskCount = tasks.filter( 
      (task)=> new Date(task.deadline) < new Date() && task.status !== "Done" ).length; 

   console.log(inProgressTaskCount)   
   console.log(doneTaskCount); 
   console.log(overdueTaskCount) 

   const taskCloseToDueDate = tasks
   .filter((task) => new Date(task.deadline) > new Date())
   .sort((a,b)=>new Date(a.deadline) - new Date(b.deadline))
   .slice(0, 3)
   .map((task)=> ({
    title : task.title, 
    priority: task.priority, 
    status: task.status,
    _id: task._id,
    deadline: task.deadline,
   })); 
   const recentOverdueTasks = tasks 
   .filter((task)=> new Date(task.deadline) < new Date() && task.status !== "Done")
   .sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
   .slice(0, 3) 
   .map((task) => ({
    title: task.title,
    priority: task.priority,
    status: task.status,
    _id: task._id,
    deadline: task.deadline,
  }));
  res.status(200).json({
    counts: {
      inProgress: inProgressTaskCount,
      completed: doneTaskCount,
      overdue: overdueTaskCount,
    },
    taskCloseToDueDate,
    recentOverdueTasks,
  });
  } catch (error) {
    console.error("Error occurred while retrieving worker analytics:", error);
    res.status(500).json({
      message: "An error occurred while retrieving worker analytics.",
      details: error.message,
    });
  }
};

