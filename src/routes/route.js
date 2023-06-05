// const express = require('express');
import express from 'express';
import { createUrl, getUrl } from '../controller/urlController.js';
const router = express.Router();

// const urlController = require('../controller/urlController');
// import urlController from '../controller/urlController.js'



//post create Url 
router.post('/url/shorten',createUrl);
//get api
router.get('/:urlCode',getUrl)

export default router;