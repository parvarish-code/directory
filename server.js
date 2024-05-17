const express = require('express');
const app = express();
const PORT = 3000;


//Basic Route
app.get('/',(req,res) => {
    res.send('Hello from Express Server');
});

//start the server
app.listen(PORT,() => {
    console.log(`Server listening at http://localhost:${PORT}`);
});