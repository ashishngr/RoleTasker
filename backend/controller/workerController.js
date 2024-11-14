const { User } = require("../models/user");
const { Task } = require("../models/task");

const WorkerController = module.exports;

WorkerController.getAllWorkers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    console.log("User Object", user);
    const workers = await User.find({ roles: "Worker" }).select(
      "firstName lastName email"
    );
    console.log("Worker list", workers)
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
