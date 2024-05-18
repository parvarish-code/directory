const express = require('express');
const app = express();
const PORT = 3000;
const Member = require('./models/member');


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

//start the server
app.listen(PORT,() => {
    console.log(`Server listening at http://localhost:${PORT}`);
});