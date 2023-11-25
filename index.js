const express = require("express")
const app = express()
require("dotenv").config();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const userCollection = client.db('realEstateDB').collection('users')

    // middlewares verify token
    const verifyToken = async (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "Unauthorized access" })
      }
      const token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized access" })
        }
        req.decoded = decoded;
        next()
      })
    }

    // check admin or agent
    const verifyAdminAgent = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email }
      const user = await userCollection.findOne(query)
      const isAdmin = user?.role === "admin"
      const isAgent = user?.role === "agent"
      if (isAdmin) {
        return res.status(200).send({ message: "Admin access", role: "admin" })
        next()
      }
      else if (isAgent) {
        return res.status(200).send({ message: "Agent Access", role: "agent" })
        next()
      }
      else {
        return res.status(403).send({ message: "Forbidden access" })
      }
    }

    // jwt related api
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
      })
      res.send({ token })
    })

    // user related api
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email }
      const isExisting = await userCollection.findOne(query)
      if (isExisting) {
        return res.send({ message: "user has already exist", insertedId: null })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })
    // check admin or agent
    app.get('/users/checkRole/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "Forbidden Access" })
      }
      const query = { email: email }
      const user = await userCollection.findOne(query)
      let roleInfo = {
        admin: false,
        agent: false,
      }
      if (user) {
        roleInfo.admin = user.role === 'admin';
        roleInfo.agent = user.role === 'agent';
      }
      res.send(roleInfo)
    })

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const role = req.body;
      const updatedRole = {
        $set:{
          role:role
        }
      }
      console.log(updatedRole)
      const result = await userCollection.updateOne(query,updatedRole)
      res.send(result)
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




app.get("/", async (req, res) => {
  try {
    res.send("The real estate project server is running")
  }
  catch (error) {
    res.status(500).send({ error: error })
  }
})
app.listen(port, () => {
  console.log(`Real estate project server is running on port ${port}`)
})