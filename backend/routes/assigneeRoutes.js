const express = require("express"); 
var router = express.Router(); 


const AssigneeController = require("../controller/assigneeController"); 
const AuthHelper = require("../helper/AuthHelper"); 
let validateToken = AuthHelper.validateToken;  

router.get("/assignee/info", validateToken, AssigneeController.getAssigneHomepAgeInfo); 

module.exports = router
