const express = require("express"); 
var router = express.Router();  

const WorkerController = require("../controller/workerController");
const AuthHelper = require("../helper/AuthHelper"); 

let validateToken = AuthHelper.validateToken; 

router.get("/worker", validateToken, WorkerController.getAllWorkers);
router.get("/getWorkerTasks", validateToken, WorkerController.getSingleWorkerTasks);
router.post("/comment", validateToken, WorkerController.addComment); 
router.get("/task/:taskId", validateToken, WorkerController.getTaskInfo); 
router.put("/task/:taskId/status", validateToken, WorkerController.updateStatus); 
router.get("/worker/analytics", validateToken, WorkerController.getWorkerAnalytics); 
router.get("/worker/info", validateToken, WorkerController.getHomePageInfo); 

module.exports = router; 