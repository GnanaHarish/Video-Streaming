const express = require("express");
const fs = require("fs");
const path = require("path");


const app = express();

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
  // const path = 'assests/EarthSam.mp4';
  // const stat = fs.statSync(path);
  // const fileSize = stat.size;
  // // console.log(stat);
  // var range = req.headers.range;
  // // console.log(range);
  // // console.log(req.headers);
  // if(!range) range = 'bytes=0-'
  // const parts = range.replace("bytes=","").split("-");
  // console.log(parts);
  // const start = parseInt(parts[0], 10);
  // const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  // // const end = parts[1];
  // console.log(start);
  // console.log(end);
  // console.log(res.Content-Range);
})

app.get("/video", function(req, res){
  const path = 'assests/EarthSam.mp4';
  const stat = fs.statSync(path);
  // console.log(stat);
  const fileSize = stat.size;
  const range = req.headers.range;
  // console.log(range);
  if(range){
      const parts = range.replace("bytes=","").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(path, {start, end});

      const head = {
        "Content-Range" : `bytes ${start}-${end}/${fileSize}`,
        "Accept-Range" : 'bytes',
        'Content-Length' : chunkSize,
        'Content-Type' : 'video/mp4'
      }
      res.writeHead(206, head);
      file.pipe(res)
  }
  else{
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
  }
})


app.listen(3000, function(){
  console.log("Listening to port 3000");
})
