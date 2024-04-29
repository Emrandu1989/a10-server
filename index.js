const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mzwb7mf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.mzwb7mf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     
    // await client.connect();
    
    const craftCollection = client.db("Art&CraftDB").collection('art&Craft')
    const SCollection = client.db("Art&CraftDB").collection('S')

    app.get('/crafts', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/s', async (req, res) => {
      const cursor = SCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query);
      res.send(result)
    })



  


    app.post('/crafts', async (req, res) => {
      const crafts = req.body;
      console.log(crafts)
      const result = await craftCollection.insertOne(crafts);
      res.send(result)
    })

    app.put('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateItem = req.body;
      const item = {
        $set: {
          ItemName: updateItem.ItemName,
          Subcategory_Name: updateItem.Subcategory_Name,
          UserName: updateItem.UserName,
          email: updateItem.email,
          Customization: updateItem.Customization,
          Processing_time: updateItem.Processing_time,
          StockStatus: updateItem.StockStatus,
          Price: updateItem.Price,
          Ratings: updateItem.Ratings,
          ImageUrl: updateItem.ImageUrl,
          Description: updateItem.Description,
        }
      }
      const result = await craftCollection.updateOne(filter, item, options)
      res.send(result);
    })



    app.delete('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('J&W Store Server is Running')
})


app.listen(port, () => {
  console.log(`J&W Server is Running on PORT: ${port}`)
})