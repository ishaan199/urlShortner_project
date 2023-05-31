const urlModel = require('../model/url');
const validUrl = require('valid-url');
const shortId = require('shortId');


const isValid = (value) => {
    if(typeof value === "undefined" || value === null) return false;
    if(typeof value === "string" && value.trim().length < 1) return false;
    return true;
};

const baseUrl = "http://localhost:3000/";


//CreateUrl 
const createUrl = async (req,res) => {
    try{
        const longUrl = req.body.longUrl;
        if(!isValid(longUrl)){
            return res.status(400).send({status:false, msg:"please enter a link as a value"})
        };
        if(!validUrl.isUri(longUrl)){
            return res.status(404).send({status:false,msg:"please Enter the Valid Url"});
        };

        let urlCode = shortId.generate().toLowerCase();
        let shortUrl = baseUrl + urlCode;

        let saveData = {longUrl, shortUrl, urlCode};
        let saveUrl = await urlModel.create(saveData)

        let result =  {
            longUrl : saveUrl.longUrl,
            shortUrl : saveUrl.shortUrl,
            urlCode : saveUrl.urlCode
        };

        res.status(201).send({status:true,data:result});
    }catch(error){
        res.status(500).send({status:false,error:error.message})
    };
};


const getUrl = async (req,res) => {
    try{
        let code = req.params.urlCode;
        let checkCode = await urlModel.findOne({urlCode:code})
        if(!checkCode) {
            return res.status(400).send({status:false,msg:"URL not found"})
        };
        res.status(400).redirect(checkCode.longUrl);

    }catch(error){
        res.status(500).send({status:false,error:error.message});
    }
}


module.exports.createUrl = createUrl;
module.exports.getUrl = getUrl;