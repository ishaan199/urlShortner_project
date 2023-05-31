const express = require('express');
const router = express.Router();

const urlController = require('../controller/urlController');

//post create Url 
router.post('/url/shortner',urlController.createUrl);
//get api
router.get('/:urlCode',urlController.getUrl)
module.exports = router;