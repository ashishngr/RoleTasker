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
        deadline
      } = req.body; 

      console.log("Body---->>>>>>>>>>>>>!!", req.body)
      // Validate required fields
      if (!title || !priority || !status) {
        return res
          .status(400)
          .json({
            error:
              "Title,  priority, and status are required fields.",
          });
      }
      if (deadline) {
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return res
            .status(400)
            .json({ error: "Invalid deadline format. Please provide a valid date." });
        }
        if (deadlineDate < new Date()) {
          return res.status(400).json({
            error: "Deadline cannot be in the past. Please provide a future date.",
          });
        }
      }
    
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({message : "User does not exists"})
    }
    console.log("User Object", user); 

    
    // Ensure `assignees` is an array and not empty
    if (!Array.isArray(assignees) || assignees.length === 0) {
      return res.status(400).json({ error: "Assignees must be a non-empty array of email addresses." });
    }

    // Fetch details for each assignee and validate existence
    const assigneeDetails = [];
    for (const email of assignees) {
      const assigneeUser = await User.findOne({ email });
      if (!assigneeUser) {
        return res.status(400).json({ error: `Assignee with email ${email} does not exist.` });
      }
      assigneeDetails.push({ userId: assigneeUser._id, email: assigneeUser.email });
    }
    console.log("Assignee Details", assigneeDetails); 

    // Create the task with the assignee's ID and email
    const newTask = new Task({
      title,
      description,
      ownerId: user._id,
      ownerEmail: user.email,
      ownerName : `${user.firstName} ${user.lastName}`,
      assignees: assigneeDetails, 
      priority,
      status,
      deadline: deadline ? new Date(deadline) : undefined,
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
    const { sortBy, priority, status, createdAt, search } = req.query; 

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
    if (search) {
      matchConditions.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search in title
        { description: { $regex: search, $options: "i" } }, // Case-insensitive search in description
      ];
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
// TODO : API to edit task by assignee
TaskController.editTask = async(req, res) =>{
  const{
    title,
    description,
    assignees,
    priority,
    status,
    deadline,
  } = req.body; 
  const { taskId } = req.params;
  console.log("Body---->>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<------", req.body)  
  console.log("taskId", taskId)
  if (!req.body || !taskId) {
    return res.status(400).json({
      error: "Invalid request data. Task ID and request body are required.",
    });
  }
  
  try {
    const task = await Task.findById(taskId); 
    console.log("req user", req.user.id)
    const userId = req.user.id; 
    console.log("UserId", userId)

    if (!task) {
      return res.status(404).json({
        error: "Task not found.",
      });
    }
    // Update the task fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status; 

    if (deadline !== undefined) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ error: "Invalid deadline date format." });
      }
      task.deadline = deadlineDate;
    }

    if (assignees !== undefined) {
      // Validate `assignees` array
      if (!Array.isArray(assignees) || assignees.length === 0) {
        return res.status(400).json({ error: "Assignees must be a non-empty array of email addresses." });
      }

      // Fetch and validate assignee details
      const assigneeDetails = [];
      for (const email of assignees) {
        const assigneeUser = await User.findOne({ email });
        if (!assigneeUser) {
          return res.status(400).json({ error: `Assignee with email ${email} does not exist.` });
        }
        assigneeDetails.push({ userId: assigneeUser._id, email: assigneeUser.email });
      }

      console.log("Updated Assignee Details:", assigneeDetails);
      task.assignees = assigneeDetails; // Update the assignees in the task
    }
    
    const updatedTask = await task.save();
    return res.status(200).json({
      message: "Task updated successfully.",
      task: {
        _id: updatedTask._id,
        title: updatedTask.title,
        description: updatedTask.description,
        assignees: updatedTask.assignees,
        priority: updatedTask.priority,
        status: updatedTask.status,
        deadline: updatedTask.deadline
      },
    });
  } catch (error) {
    console.error("Error occurred while creating task:", error);
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
}
// TODO : Assignee analytics API 
TaskController.getAnalyticsData = async(req, res) =>{
  try {
    const { filter } = req.query;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return res.status(400).json({ message: "User does not exist" });
    } 
    console.log("Filters------>", filter) 
    const currentDate = new Date();
    let startDate, endDate; 
    switch (filter) {
      case 'today':
        startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        endDate = new Date(currentDate.setHours(23, 59, 59, 999));
        break;
      case 'thisWeek':
        startDate = new Date();
        startDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setDate(startDate.getDate() + 6); // End of the week
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'thisMonth':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the month
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999); // End of the month
        break;
      case 'lastSixMonths':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1); // Start of six months ago
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999); // End of this month
        break;
      case 'thisYear':
        startDate = new Date(currentDate.getFullYear(), 0, 1); // Start of the year
        endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999); // End of the year
        break;
      case 'all':
        startDate = new Date(0); // Earliest date
        endDate = new Date(); // Now
        break;
      default:
        return res.status(400).json({ error: "Invalid filter" });
    } 
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }, // Filter by date range
        },
      },
      {
        $facet : {
          tasksByStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { status: "$_id", count: 1, _id: 0 } },
          ],
          tasksByPriority: [
            { $group: { _id: "$priority", count: { $sum: 1 } } },
            { $project: { priority: "$_id", count: 1, _id: 0 } },
          ],
          taskCreationOverTime: [
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
            {
              $project: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
                count: 1,
                _id: 0,
              },
            },
          ],
          tasksAssignedToWorkers: [
            { $unwind: "$assignees" },
            {
              $group: {
                _id: "$assignees._id",
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
        }
      }
    ];

    const analyticsData = await mongoose.model('Task').aggregate(pipeline);
    res.status(200).json({ success: true, data: analyticsData }); 


  } catch (error) {
    res.status(500).json({
      error: "An error occurred while creating the task.",
      details: error.message, // Include the actual error message in the response
    });
  }
}

