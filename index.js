const { MongoClient } = require('mongodb');
const express = require("express");
require('dotenv').config()
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.btdeq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
try{
await client.connect();

const database = client.db("tourApp");
const productCollection = database.collection("products");
const orderCollection = database.collection("orders");

//post api
app.post('/addService',async(req,res)=>{
    const product = req.body;
    const result = await productCollection.insertOne(product);
    res.send(result);
})

//get data from db to ui
app.get('/services',async(req,res)=>{
    const cursor =  productCollection.find({});
    const services = await cursor.toArray();
    res.send(services);
})

//post order
app.post('/placeOrder',async(req,res)=>{
    const orders = req.body;
    const result = await orderCollection.insertOne(orders);
    res.send(result);
})

//get order data from db to ui
app.get('/allOrders',async(req,res)=>{
    const cursor =  orderCollection.find({});
    const orders = await cursor.toArray();
    res.send(orders);
})


 // my orders

 app.get("/myOrders/:email", async (req, res) => {
    const myOrder = await orderCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(myOrder);
  });

  //delete Order from ui
  app.delete("/deleteOrder/:id", async (req, res) => {
    const id = req.params.id;
    const result = await orderCollection.deleteOne({
      _id: ObjectId(id),
    });
    res.send(result);
    
  });




}
finally{
    //await client.close()
}
}

run().catch(console.dir)


app.get("/",(req,res)=>{
    res.send("hello world");
});

app.listen(port,()=>{
    console.log("running server on port", port);
});