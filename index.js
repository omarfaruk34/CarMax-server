const express = require("express");
const { MongoClient } = require('mongodb');
const app  = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = 8000 || process.env.PORT;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y2457.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run(){
    try{
        await client.connect();
        const database = client.db("carmax");
        const carCollection = database.collection("cars");
        const ordersCollection = database.collection("orders");
        const usersCollection = database.collection("users");
        const usersReview = database.collection("users_review");
        const contactCollection = database.collection("contact");

    
        app.post('/addCar', async (req,res)=>{
            const result = await carCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
          });
          app.get('/addCar', async (req,res)=>{
            const result = await carCollection.find({}).toArray();
            res.json(result);
          });
          app.get('/addCar/:id', async (req,res)=>{
            const query = { _id: ObjectId(req.params.id) }
            const car = await carCollection.findOne(query);
            res.send(car);
        });
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(req.body)
            const result = await usersReview.insertOne(review)
            res.send(result)
          });
          app.get('/reviews', async (req, res) => {
            const result = await usersReview.find({}).toArray();
            res.send(result)
          });
          app.post('/orders', async(req,res)=>{
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        });
          app.get('/orders', async (req, res) => {
          const result = await ordersCollection.find({}).toArray();
          res.send(result)
        });
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const result = await ordersCollection.find({ email: { $regex: email } }).toArray();
            res.send(result);    
          });


          app.post('/contact', async(req,res)=>{
            const result = await contactCollection.insertOne(req.body);
            res.send(result);
        });
          app.get('/contact', async (req, res) => {
          const result = await contactCollection.find({}).toArray();
          res.send(result)
        });
    }
    finally{}
}
run().catch(console.dir)

app.get("/", (req,res)=>{
    res.send('hello joy, khaled, nishat')
})

app.listen(port, ()=>{
    console.log(`port run on ${port}`)
})