// git commit -m "first commit"
// git remote add origin https://github.com/celinescode/2095lsb5.git

// git push -u origin master

var express=require('express');
var app=express();

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
mongoose.set('useNewUrlParser',true);

let Tasks = require('./models/tasks');
let Developers = require('./models/developers');
// const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/fit2095db";

mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }

    console.log('Successfully connected');
    
})
//config, Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); // use html template

//Setup the static assets directories, without this step they will not be able to use
app.use(express.static('images'));
app.use(express.static('css'));
//when a request arrive, bodyparser will do some pre-processing
app.use(bodyParser.urlencoded({
    extended: false //only string or array
}));
app.use(bodyParser.json()); //handle more complex format such as nested

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('/newtask', function (req, res) {
    res.render('newtask.html')  
})

app.get('/listtasks',function(req,res){
    Tasks.find().exec(function(err,data){
        res.render('listtasks',{tasks:data});
    })
})

app.get('/deletetask',function (req,res) {
    res.render('deletetask.html')
    
})

app.get('/deletecomplete', function (req,res) {
    Tasks.find().exec(function(err,data) {
        res.render('deletecomplete', { tasks: data });   
    });    
})

app.get('/updatetask', function (req,res) {
    res.render('updatetask.html')
    
})

app.get('/adddeveloper', function (req,res) {
    res.render('adddeveloper.html')
    
})

app.post('/newdeveloper', function (req,res) {

    let details = req.body;
    

    Developers.create({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: details.fname,
            lastName: details.lname
        },
        level: details.level,
        address:{
            state: details.state,
            suburb: details.suburb,
            street: details.street,
            unit: details.unit}
        },function(err){
            if(err){
                console.log(err)
            }else{
                res.redirect('/listdeveloper');
            }
        })
    
});

app.get('/listdeveloper',function(req,res){
    Developers.find().exec(function(err,data){
        res.render('listdeveloper',{devDB:data});
    })
})


//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/addnewtask', function (req, res) {
    let taskDetails = req.body;
    Tasks.create({
        taskName: taskDetails.taskName,
        assignTo: {_id:new mongoose.Types.ObjectId(taskDetails.assignTo)},
        dueDate: taskDetails.dueDate, 
        taskStatus: taskDetails.taskStatus, 
        taskDescription: taskDetails.taskDescription
        
        },function(err){
            if(err){
                console.log(err)
            }else{
                res.redirect('/listtasks');
            }
        })
    
});

app.post('/deletetaskdata',function (req,res) {

    let query ={_id: new mongoose.Types.ObjectId(req.body.taskID)};
    Tasks.deleteOne(query, function (err, doc) {
        console.log(doc);
        res.redirect('/listtasks')
    
    });

});

app.post('/deletecompletedata',function (req,res) {

    let query ={taskStatus: 'Completed'};
    Tasks.deleteMany(query,function (err,doc) {
        console.log(doc);
        res.redirect('/listtasks')
    });
    
    
});

app.post('/update', function (req,res) {
    let query ={_id:req.body.taskID};
    let theUpdate = {$set: {taskStatus: req.body.taskStatus}};
    Tasks.updateOne(query, theUpdate,function (err,doc) {
        if (err) {
            console.log(err)
        } else {
            console.log(doc)
        }
    });
    res.redirect('listtasks');

})


app.listen(8080,()=>console.log("server is running at http://localhost:8080"))