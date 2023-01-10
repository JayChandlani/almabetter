const http = require('http');
const fs = require('fs');
const https = require('https')

const url = 'https://jsonplaceholder.typicode.com/users';
const getAPI = () => {
    https.request(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data = data + chunk.toString()
        })
        res.on('end', () => {
            fs.writeFile('test.json', data, (err) => {
                if (!err) {
                    console.log('write method complete');
                } else {
                    console.log(err);
                }
            })
        })
    }).end()
}

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    if (req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                res.end()
            } else {
                console.log(err);
            }
        })
    } else if (req.url === '/contact') {
        fs.readFile('contact.html', (err, data) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                res.end()
            } else {
                console.log(err);
            }
        })
    } else if (req.url === '/folder') {
        fs.readdir('./', (err, data) => {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(`<ul>${data.map((item) => { return `<li  style="font-size:21px;">${item}</li>` })} </ul>`);
                res.end();
            } else {
                console.log(err);
            }
        })
    } else if (req.url === '/save') {

        getAPI();
        res.write(`<h1>Data Fetch Successfully and saved in test.json file</h1>`);
        res.end();
    }
}).listen(3000)