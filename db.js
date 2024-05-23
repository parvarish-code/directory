const mongoose = require('mongoose');
const url = 'mongodb+srv://parvarishbedi:IBkOB4n4xCrJIvcn@directory.ccxfwuv.mongodb.net/?retryWrites=true&w=majority&appName=directory'

mongoose.connect(url)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Could not connect to MongoDB',err));