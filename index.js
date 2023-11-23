const express = require("express")
const app = express()
require("dotenv").config();
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

console.log(process.env.DB_PASS,process.env.DB_USER)

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.49cfwvw.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", async (req, res) => {
    try {
        res.send("The real estate project server is running")
    }
    catch (error) {
        res.status(500).send({ error: error })
    }
})
app.listen(port,()=>{
    console.log(`Real estate project server is running on port ${port}`)
})