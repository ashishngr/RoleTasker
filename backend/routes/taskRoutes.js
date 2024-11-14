const express = require("express"); 
var router = express.Router(); 
 
const TaskController = require("../controller/taskController"); 
const AuthHelper = require("../helper/AuthHelper"); 

let validateToken = AuthHelper.validateToken; 

router.post("/createTask", validateToken, TaskController.createTask); 
router.get("/tasks", validateToken, TaskController.getAllTasks);

module.exports = router; 