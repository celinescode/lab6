let mongoose = require('mongoose');

let tasksSchema = mongoose.Schema({
    taskName: String,
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developers'
    },
    dueDate: Date,
    taskStatus: {
        type : String,
        enum : ['inProgress', 'Completed'] 
    },
    taskDescription: String
});

module.exports = mongoose.model('Tasks', tasksSchema);