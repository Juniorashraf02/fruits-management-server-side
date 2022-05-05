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
        const newCollection = client.db('warehouseMangement').collection('newItem');
        


        // getting all the products
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });


        // getting a specific item by id
        app.get('/items/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const items = await productCollection.findOne(query);
            res.send(items);
        });


        // posting a new product
        app.post('/add-item',async(req, res)=>{
            const newItem = req.body;
            const result = await productCollection.insertOne(newItem);
            res.send(result);
        });


        // Delete a product by id 
        app.delete('/items/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
            
        });

        


        // update a info of a product by id
        app.put('/items/:id', async(req, res) => {
            console.log({req})
            const id = req.params.id;
            const data = req.body;
            console.log(data);
            
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {quantity:data.newQuantity}
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await productCollection.insertOne(newItem);
            res.send(result);
        });

        app.get('/myitem', async(req, res)=>{
            const email = req.query.email;
            console.log(email);
            const query = {email:email};
            const cursor = productCollection.find(query);
            const items = await cursor.toArray();
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