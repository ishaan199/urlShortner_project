// const urlModel = require('../model/url');
import urlModel from '../model/url.js'
// const validUrl = require('valid-url');
import validUrl from 'valid-url';
// const shortId = require('shortId');
import shortId from "shortId";
// const redis = require('redis');
import redis from 'redis'
// const {promisify} = require('util');
import { promisify } from 'util';
// import {createClient} from 'redis'

const isValid = (value) => {
    if(typeof value === "undefined" || value === null) return false;
    if(typeof value === "string" && value.trim().length < 1) return false;
    return true;
};

const urlValidation = (str) => {
    let urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
    return urlRegex.test(str);
};

const baseUrl = "http://localhost:3000/";


// ===============================>connecting to the redis
const redisClient = redis.createClient(
  12942,
  "redis-12942.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("mBMfTKJTyUN9FnbWvJ9GL9Vu1TzucWZC", function (err) {
  if (err) throw err;
});
redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//CreateUrl 
export const  createUrl = async (req,res) => {
    try{
        let data = req.body
        if(Object.keys(data).length < 1) {
            return res.status(400).send({status:false,msg:"Provide Properties in the body"})
        }
        const longUrl = req.body.longUrl;

        if(!urlValidation(longUrl)){
            return res.status(400).send({status:false,msg:"This url is not valid"})
        }
        if(!isValid(longUrl)){
            return res.status(400).send({status:false, msg:"please enter a link as a value"})
        };
        if(!validUrl.isUri(longUrl)){
            return res.status(404).send({status:false,msg:"please Enter the Valid Url"});
        };
        let cacheData = await GET_ASYNC(`${longUrl}`);

        if(cacheData){
            let cacheUrlData = JSON.parse(cacheData);


            let data = {
              longUrl: cacheUrlData.longUrl,
              shortId: cacheUrlData.shortUrl,
              urlCode: cacheUrlData.urlCode,
            };
            return res.status(200).send({ status: true, message: "url already exist", data: data })
        }else{
            let urlCode = shortId.generate().toLowerCase();
            let shortUrl = baseUrl + urlCode;
            
            let saveData = {longUrl, shortUrl, urlCode};
            let saveUrl = await urlModel.create(saveData)
            
            let result =  {
                longUrl : saveUrl.longUrl,
                shortUrl : saveUrl.shortUrl,
                urlCode : saveUrl.urlCode
            };
            await SET_ASYNC(`${longUrl}`, JSON.stringify(result));
            res.status(201).send({status:true,data:result});
        }
    }catch(error){
        res.status(500).send({status:false,error:error.message})
    };
};


export const getUrl = async (req,res) => {
    try {
      let urlCode = req.params.urlCode;

      // let url1 = await urlModel.findOne({ urlCode })
      let url = await GET_ASYNC(`${urlCode}`);

      // if (url1) {
      if (url) {
        return res.status(200).redirect(JSON.parse(url).longUrl);
        // return res.status(200).redirect(url1.longUrl)
      }

      let url1 = await urlModel.findOne({ urlCode });
      if (url1) {
        await SET_ASYNC(`${urlCode}`, JSON.stringify(url1));
        return res.status(200).redirect(url1.longUrl);
      } else {
        return res
          .status(404)
          .send({ status: false, msg: "short url not found" });
      }
    } catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
}


// module.exports.createUrl = createUrl;

// module.exports.getUrl = getUrl;
