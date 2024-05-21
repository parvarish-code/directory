const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const Member = require('./models/member');

app.use(cors());// Enable cors for all routes


//Basic Route
app.get('/',(req,res) => {
    res.send('Hello from Express Server');
});

//Create ( POST )

app.post('/members',async(req,res) => {
    try {
        const newMember = new Member(req.body);
        const savedMember = await newMember.save();
        res.status(201).json(savedMember);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// Read ( GET - all members )
app.get('/members',async(req,res) => {
    try {
        const members = await Member.find({});
        res.json(members);
    } catch (error) {
        res.status(500).json({ error : error.message})
    }
});

//Read ( GET - a single member )
app.get('/members/:id',async (req,res) => {
    try {
        const member = await Member.findById(req.params.id);
        if(!member){
            return res.status(404).json({error:'Member not found'});
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

//Update (PUT)
app.put('/member/:id',async(req,res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!updatedMember){
            return res.status(404).json({ error:"Member not found"});
        }
        res.json(updatedMember);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

//DELETE ( DELETE )
app.delete('/members/:id',async(req,res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(req.params.id);
        if(!deletedMember){
            return res.status(404).json({error:"Member not found"})
        }
        res.json({message:"Member Deleted"})
    } catch (error) {
        res.status(500).json({ error:error.message});
    }
})

//start the server
app.listen(PORT,() => {
    console.log(`Server listening at http://localhost:${PORT}`);
});