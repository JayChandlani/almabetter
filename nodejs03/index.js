var express = require('express');
var app = express();
const fs = require('fs')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.post('/submit', (req, res) => {
  let formData = JSON.stringify(req.body);
  fs.appendFile('test.json', formData,  (err) =>{
    if (err) {
      console.log(err)
    }
    else { console.log('Append operation complete.') 
    res.status(200).send({ msg: "Data Added Successfully" })}
  });
})

app.get('/all', (req, res) => {
  fs.readFile('test.json',  (err, data)=> {
    if (!err) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    } else {
      console.log('error');
    }
  });
})

app.listen(3000, function () {
  console.log('Node server is running on port : ', 3000);
});


