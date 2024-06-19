const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}....`);
});

mongoose.connect('mongodb://0.0.0.0/task-manager',{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{console.log('Connected to MongoDb');})
.catch((error)=>{console.log('Error connected to Database:',error)});

const taskSchema = new mongoose.Schema({
    task: {
    type:String,
    required:true
    },
    status:{
        type:String,
        required:true,
        default:"Not Done"
    }
});

const Task = mongoose.model('Task',taskSchema);

app.get('/api/tasks',async (req,res)=>{         //get all tasks in database
    try{
        const tasks = await Task.find();
        res.json({tasks});
    } catch(error){
        console.error('Error fetching the database :',error);
        res.status(500).json({error: 'Internal server error'});
    }
});
app.post('/api/tasks',async (req,res)=>{      //create new task and save in database
    const { task } = req.body;
    try{
        const newTask = new Task({ task });
        await newTask.save();
        res.json(newTask);
    }
    catch(error){
        console.error('Error creating new task : ',error);
        res.status(500).json({error:'Internal server error'});
    }
});
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.put('/api/tasks/:id',async (req,res)=>{        //edit a task and save in db
    try {
        await Task.findOneAndUpdate(
            { _id: req.params.id },
            { task: req.body.task , status: req.body.status }
        )
        const todo = await Task.findById(req.params.id);

        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json(error.message);
    }
})
app.delete('/api/tasks/:id',async (req,res)=>{        //find and delete db
    try{
        const {task} = await Task.findByIdAndDelete(req.params.id);
        return res.status(200).json(todo);
    } catch (error) {
        return res.status(500).json(error.message);
    }
})