const { User } = require("../models/user");
const {Task} = require("../models/task");
const mongoose = require("mongoose");

const TaskController = module.exports;


// TODO : API to create task by assignee
TaskController.createTask = async (req, res) => {
    const {
        title,
        description,
        assignees,
        priority,
        status,

      } = req.body; 
      console.log("Body---->>>>>>>>>>>>>", req.body)
      // Validate required fields
      if (!title || !priority || !status) {
        return res
          .status(400)
          .json({
            error:
              "Title,  priority, and status are required fields.",
          });
      }
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({message : "User does not exists"})
    }
    console.log("User Object", user); 

    const assigneeUser = await User.findOne({ email: assignees });
    if (!assigneeUser) {
      return res.status(400).json({ error: "Assignee with the specified email does not exist" });
    }
    // Create the task with the assignee's ID and email
    const newTask = new Task({
      title,
      description,
      ownerId: user._id,
      ownerEmail: user.email,
      ownerName : `${user.firstName} ${user.lastName}`,
      assignees: [{ userId: assigneeUser._id, email: assigneeUser.email }], // Add assignee details
      priority,
      status,
    });
    // Save the task to the database
    const savedTask = await newTask.save();
    console.log("Saved task:", savedTask);
    res.status(201).json({ message: "Task created successfully", task: savedTask });
   
  } catch (error) {
    console.error("Error occurred while creating task:", error);
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
};
//TODO : API to get all task's based on the login user's - if user is Assignee
TaskController.getAllTasks = async(req, res) =>{
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return res.status(400).json({ message: "User does not exist" });
    }

    // Retrieve filters from the request query
    const { sortBy, priority, status, createdAt } = req.query; 

    console.log("req.query^^^^^^^^^^^^^^^^^^^^", req.query); 

    // Construct the match conditions for the query
    const matchConditions = { ownerId: new mongoose.Types.ObjectId(userId) };

    // Apply filters if they are provided
    if (priority) matchConditions.priority = priority;
    if (status) matchConditions.status = status;

    // Handle createdAt filter for Today, This Week, This Month, and All
    const currentDate = new Date();
    if (createdAt === "Today") {
      matchConditions.createdAt = {
        $gte: new Date(currentDate.setHours(0, 0, 0, 0)), // Start of today
        $lt: new Date(currentDate.setHours(23, 59, 59, 999)) // End of today
      };
    } else if (createdAt === "This Week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      matchConditions.createdAt = {
        $gte: startOfWeek,
        $lt: endOfWeek
      };
    } else if (createdAt === "This Month") {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);

      matchConditions.createdAt = {
        $gte: startOfMonth,
        $lt: endOfMonth
      };
    }

    // Log the match conditions
    console.log("Match Conditions:", matchConditions);

    // Set up sorting options based on sortBy parameter
    const sortOptions = { createdAt: -1 };
    if (sortBy === "oldest") {
      sortOptions.createdAt = 1; // Sort by oldest
    }

    // Log sorting options
    console.log("Sort Options:", sortOptions);

    // Execute the aggregation pipeline with match and sort stages
    const tasks = await Task.aggregate([
      { $match: matchConditions },
      { $sort: sortOptions }
    ]);

    // Log the fetched tasks
    console.log("Fetched Tasks:", tasks);

    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: tasks,
      totalTasks: tasks.length
    });
  } catch (error) {
    console.error("Error occurred while retrieving tasks:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the tasks.",
      details: error.message // Include the actual error message in the response
    });
  }
}
