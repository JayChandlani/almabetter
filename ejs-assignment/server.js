const { MongoClient } = require('mongodb');
const express = require('express');
const url = "mongodb://localhost:27017";
const dbName = 'contactlist';
const client = new MongoClient(url)
const PORT = 8000;
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
async function getData() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('users');
    return collection;
}

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index')
})
app.post('/add', async (req, res) => {
    const collection = await getData();
    const result = await collection.insertOne(req.body);
    if (result.acknowledged) {
        res.redirect('/')
    }

})
// app.delete('/delete', async (req, res) => {
//     const collection = await getData();
//     const result = await collection.deleteOne()
// })
app.get('/all', async (req, res) => {
    const collection = await getData();
    const result = await collection.find().toArray();
    res.render('pages/contact', {
        data: result
    })
})
app.listen(PORT, () => {
    console.log('App Running On ' + PORT);
})
