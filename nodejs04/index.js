const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();
const fs = require('fs')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT


function validate(req, res, next) {
    const { name, address, number } = req.body
    if (name.length > 5 && address.length > 10 && number.length === 10) {
        next()
    } else {
        res.status(400).send('Please Provide Valid details')
    }
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.post('/submit',validate, (req, res) => {
    fs.readFile('test.json', (err, data) => {
        if (!err) {
            let files = JSON.parse(data)
            let formData = JSON.stringify([...files, req.body]);
            fs.writeFile('test.json', formData, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log('Append operation complete.')
                    res.redirect('/')
                }
            });
        } else {
            console.log(err);
        }
    })

})

app.get('/all', (req, res) => {
    fs.readFile('test.json', (err, data) => {
        if (!err) {
            res.writeHead(200, { 'Content-Type': 'text/json' });
            res.write(data);
            res.end();
        } else {
            console.log('error');
        }
    });
})

app.listen(PORT, function () {
    console.log('Node server is running on port : ', PORT);
});


