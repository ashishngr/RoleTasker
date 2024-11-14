const express = require("express"); 
var router = express.Router();  

const WorkerController = require("../controller/workerController");
const AuthHelper = require("../helper/AuthHelper"); 

let validateToken = AuthHelper.validateToken; 

router.get("/worker", validateToken, WorkerController.getAllWorkers);

module.exports = router; 