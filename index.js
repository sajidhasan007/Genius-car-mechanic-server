const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 5000;


//midleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4sj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected successfully');
        const database = client.db("car-maechanic");
        const servicescollection = database.collection("services");


        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('server is hitting', service);

            const result = await servicescollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })


        app.get('/services', async (req, res) => {
            const cursor = servicescollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete is hitted by ', id);
            const query = { _id: ObjectId(id) };
            const result = await servicescollection.deleteOne(query);
            res.json(result);

        })

        app.get('/services/:id', async (req, res) => {
            console.log('getting the service');
            const id = req.params.id;
            // console.log('getting the services of ', id);
            const query = { _id: ObjectId(id) };
            const result = await servicescollection.findOne(query);
            console.log(result)
            res.json(result);
        })

    } finally {
        //await client.close();
    }
}


run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('backend is running');
    res.send('hello from backend');
})

app.listen(port, () => {
    console.log('backend is listining and running');
})