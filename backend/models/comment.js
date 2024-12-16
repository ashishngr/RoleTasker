const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;

const CommentSchema = new Schema({
    taskId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Task', 
        required : true
    }, 
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User', 
        required : true
    }, 
    userName: { type: String, required: true },
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [1000, 'Comment content cannot exceed 1000 characters'],
    }
},
{
    collection: "comment",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
} 
)
const Comment = mongoose.model('Comment', CommentSchema); 
module.exports = {
    Comment
}
