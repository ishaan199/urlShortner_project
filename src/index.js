const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/route');
const app = express();

app.use(express.json());

let port = 3000;
let url = "";
mongoose.connect(url,{
    useNewUrlParser:true
}).then(()=>{console.log("MongoDb is connected")}).catch((err)=>{console.log(err.message)});

app.use('/',route);

app.listen(port,()=>{
    console.log(`Server is listing on port : ${port}`);
});