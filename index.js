// const nanoid = require('nanoid');
// const express = require('express');
import express from 'express'
import {nanoid} from 'nanoid'
import fs  from 'fs'
// import { stringify } from 'querystring';
const PORT = 4000;
import path from "node:path";
import { fileURLToPath } from "node:url";
const server = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// const isUrlValid = (url)=>{
//     try{
//         new URL(url);
//         return true;
//     } catch (err){
//         return false;
//     }
// };

server.use(express.json());

server.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  

server.post('/url-shorter',(request,response)=>{

    

    const shortUrl = nanoid(8);
    const urlStore = {
        [shortUrl] : request.body.url
    };

    // if(!isUrlValid(req.body.url)){
    //     return response.status(400).json({
    //         success:false,
    //         message:"Invalid URL, Please Enter Valid URL"
    //     });
    // }

    const urlFileData = fs.readFileSync("urlStore.json",{encoding:"utf-8"});
    const urlFileDataJson = JSON.parse(urlFileData);
    urlFileDataJson[shortUrl] = request.body.url;
    fs.writeFileSync("urlStore.json", JSON.stringify(urlFileDataJson));

    response.json({
        success : true,
        data: `http://localhost:4000/${shortUrl}`,

    });

});


server.get("/:shortUrl", (req, res) =>{
    const urlFileData = fs.readFileSync("urlStore.json",{encoding:"utf-8"});
    const urlFileDataJson = JSON.parse(urlFileData);
    const url = urlFileDataJson[req.params.shortUrl];
    res.redirect(url);
   


    res.json({
        message:"short url received successfully",
        
    });
});

server.listen(PORT , ()=>{
    console.log("server is running on port: "+PORT);
})
