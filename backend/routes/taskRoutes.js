const express = require("express"); 
var router = express.Router(); 
 
const TaskController = require("../controller/taskController"); 
const AuthHelper = require("../helper/AuthHelper"); 

let validateToken = AuthHelper.validateToken; 

router.post("/createTask", validateToken, TaskController.createTask); 
router.get("/tasks", validateToken, TaskController.getAllTasks);
router.put("/task/:taskId",validateToken, TaskController.editTask); 
router.get("/task/analytics", validateToken, TaskController.getAnalyticsData); 

module.exports = router; 
