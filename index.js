const express = require('express');
const port = process.env.PORT || 8000;

const dotenv = require('dotenv').config();

// import routes
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose');
// create an express app
const app = express();

mongoose.connect('mongodb://localhost/demoDB', {useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology : true})
.then(()=> console.log("Connected to database!"))
.catch((error) => console.log("Error in connecting to the database"))

app.use(express.json());
app.use('/api/v1', authRoutes);

// listen to the port 
app.listen(port, (error)=> {
    if(error) {
        console.log(`Problem in running the server, ${error}`)
    }

    console.log(`Server is listening on port : ${port}`)
})