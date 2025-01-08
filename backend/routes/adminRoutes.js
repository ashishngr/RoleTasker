const express = require("express"); 
var router = express.Router(); 

const AdminController = require("../controller/adminController")
const AuthHelper = require("../helper/AuthHelper"); 
let validateToken = AuthHelper.validateToken;   

router.get("/admin/home/analytics", validateToken, AdminController.getAdminHomePageAnalytics); 
router.get("/admin/task", validateToken, AdminController.getAllTasks); 
router.get("/admin/staticAnalytic", validateToken, AdminController.staticAnalytics); 
router.get("/admin/performaceMetrics", validateToken, AdminController.getPerformanceMetrics); 
router.get("/admin/analyticsData", validateToken, AdminController.getAnalyticsData); 
module.exports = router
