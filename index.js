const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions ={
    // origin:'https://inverted-index-generator.vercel.app',
    origin: 'http://localhost:3001', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
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

app.post('/', (req, res) => {
    const USERNAME = process.env.NAME;
    const PASSWORD = process.env.PASS;
    datainsert(USERNAME, PASSWORD, req.body.update).then(function(result){res.send({"status":result})});
})

app.listen(PORT, function (err) {
    if (err) console.log("Error is" + err);
}); 

module.exports = app;