const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7s7c1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('warehouseMangement').collection('service');

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/items/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const items = await productCollection.findOne(query);
            res.send(items);
        });



    }
    finally { }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('working');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})


// warehouseManagement
// zAK98yOMwQ38XoGC