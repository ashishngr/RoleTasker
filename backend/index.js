const express = require("express"); 
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express(); 
const PORT = process.env.PORT || 8080; 

const mongoUri = process.env.DATABASE; 
mongoose.set("strictQuery", false); 

mongoose.connect(mongoUri)
.then(()=>{
    console.log("MongoDB Conttected")
}); 


const authRoutes = require("./routes/authRoutes"); 
const taskRoutes = require("./routes/taskRoutes")
const workerRoutes = require("./routes/workerRoutes");  
const assigneeRoutes = require('./routes/assigneeRoutes'); 
const adminRoutes = require("./routes/adminRoutes"); 

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(cookieParser());  


app.use("/api/v1", authRoutes);
app.use("/api/v1", taskRoutes); 
app.use("/api/v1", workerRoutes); 
app.use("/api/v1", assigneeRoutes); 
app.use("/api/v1", adminRoutes); 

app.listen(PORT,()=> console.log("Server is running on port : " + PORT)); 
module.exports = app;

