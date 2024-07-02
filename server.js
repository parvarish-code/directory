const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const PORT = 3001;
const Member = require('./models/member');
const Bulletin = require('./models/bulletin');
const Message = require('./models/message');
const { Mongoose } = require('mongoose');
require('./db');

app.use(cors());// Enable cors for all routes
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Basic Route
app.get('/',(req,res) => {
    res.send('Hello from Express Server');
});

//Register new member
app.post('/register',async(req,res) => {
    try {
        const {name,email,password} = req.body;

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newMember = new Member({
            name,
            email,
            password:hashedPassword
        });

        const savedMember = await newMember.save();
        res.status(201).json({ message:'Member registered Successfully'});
    } catch (error) {
        res.status(500).json({ error:error.message});
    }
});

//Authenticate Member
app.post('/login',async(req,res) => {
    try {
        const { email,password } = req.body;
        const member = await Member.findOne({email});

        if(!member || !await bcrypt.compare(password,member.password)){
            return res.status(401).json({ error:'Invalid Credentials'});
        }

        const token = jwt.sign({userId:member._id},'code everything');
        res.json({token,member});
    } catch (error) {
        res.status(500).json({ error:error.message});
    }
})

//verify token route
app.post('/verifyToken',async(req,res)=>{
    try {
        const { token } = req.body;
        

        const decoded = jwt.verify(token,'code everything');
        const member = await Member.findById(decoded.userId);

        if(!member){
            return res.status(401).json({ error:'Invalid token'});
        }

        res.json({ valid:true,member});
    } catch (error) {
        res.status(401).json({ error:'Invalid token'});
    }
})

//Create ( POST )

// app.post('/members',async(req,res) => {
//     try {
//         const newMember = new Member(req.body);
//         const savedMember = await newMember.save();
//         res.status(201).json(savedMember);
//     } catch (error) {
//         res.status(500).json({ error: error.message});
//     }
// });

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
        console.error('erroorrrrr')
        res.status(500).json({error:error.message});
    }
});

//Update (PUT)
app.put('/members/:id',async(req,res) => {
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

app.get('/bulletin',async (req,res) => {
    console.log('fetch bulletin')
    const foundBulletin = await Bulletin.findOne({}).populate('messages').exec();
    console.log(foundBulletin)
    res.status(201).json({bulletin:foundBulletin})
});
 
app.post('/admin/:id/bulletin',  async (req,res)=>{
    const {heading,body} = req.body;
    const admin = await Member.findById(req.params.id);
    console.log(admin)

    try {
        const newMessage = new Message({ 
            heading,
            body,
            date:Date.now(),
            author:admin._id
         });
       await newMessage.save();

    //   const newBulletin = new Bulletin({messages:[]})
    //   await newBulletin.save();

    //   console.log(newBulletin)

       const FoundBulletin = await Bulletin.findOne({});
      
        
       FoundBulletin.messages.push(newMessage);
       FoundBulletin.save()
        
    } catch (error) {
        console.log(error)
    }
    
});

//start the server
app.listen(PORT,() => {
    console.log(`Server listening at http://localhost:${PORT}`);
});