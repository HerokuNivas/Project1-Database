const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
require('dotenv').config();


const PORT = process.env.PORT || 3000;

async function datainsert(USERNAME, PASSWORD, UPDATE){
    const uri = "mongodb+srv://"+USERNAME+":"+PASSWORD+"@cluster0.ciz9ysq.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    console.log(uri);
    var success = "Success";
    try {
        const databaseIs = client.db("invertedindex");
        const collectionIs = databaseIs.collection("update");
        const doc = {
            update: UPDATE
        }
        await collectionIs.insertOne(doc);
    }
    catch(err) {
        console.log(err);
        success = "failure"
    }
    finally {
        await client.close();
    }
    console.log(success);
    return success;
}

app.get('/', (req, res) => {
    const USERNAME = process.env.NAME;
    const PASSWORD = process.env.PASS;
    datainsert(USERNAME, PASSWORD, req.query.update).then(function(result){res.send({"status":result})});
    
})

app.listen(PORT, function (err) {
    if (err) console.log("Error is" + err);
}); 

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

module.exports = app;