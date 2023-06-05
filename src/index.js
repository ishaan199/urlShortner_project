// const express = require('express');
import express from 'express'
// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// const cors = require('cors');
import cors from 'cors'
// const route = require('./routes/route');
import route from '../src/routes/route.js';
const app = express();

app.use(express.json());
app.use(cors());
let port = 3001;
let url = "mongodb+srv://ishaan:ishaan007@cluster1.wumfpap.mongodb.net/urlShortnerGroup5";
mongoose.connect(url,{
    useNewUrlParser:true
}).then(()=>{console.log("MongoDb is connected")}).catch((err)=>{console.log(err.message)});

app.use('/',route);

app.listen(port,()=>{
    console.log(`Server is listing on port : ${port}`);
});