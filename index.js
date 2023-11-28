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
    const propertyCollection = client.db('realEstateDB').collection('properties')
    const reviewCollection = client.db('realEstateDB').collection('reviews')
    const wishListCollection = client.db('realEstateDB').collection('wishlist')
    const propertyBroughtCollection = client.db('realEstateDB').collection('propertyBrought')

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
        // return res.status(200).send({ message: "Admin access", role: "admin" })
        next()
      }
      else if (isAgent) {
        // return res.status(200).send({ message: "Agent Access", role: "agent" })
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
    // update user role
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const { role } = req.body;
      const updatedRole = {
        $set: {
          role: role
        }
      }
      const result = await userCollection.updateOne(query, updatedRole)
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
      res.send({ roleInfo })
    })

    // properties related api
    app.post('/properties', async (req, res) => {
      const properties = req.body;
      const result = await propertyCollection.insertOne(properties)
      res.send(result)
    })
    app.get('/properties/verified', async (req, res) => {
      const query = { verified_status: "verified" }
      const result = await propertyCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/manageProperties', async (req, res) => {
      const result = await propertyCollection.find().toArray()
      res.send(result)
    })
    app.get('/agentProperties/:email', async (req, res) => {
      const email = req.params.email;
      const query = { agentEmail: email }
      const result = await propertyCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/singleProperties/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await propertyCollection.findOne(query)
      res.send(result)
    })
    app.delete('/properties/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await propertyCollection.deleteOne(query)
      res.send(result)
    })
    app.patch('/properties/:id', async (req, res) => {
      const property = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const updateProperty = {
        $set: {
          propertyImage: property.propertyImage,
          propertyTitle: property.propertyTitle,
          propertyLocation: property.propertyLocation,
          priceRange: property.priceRange
        }
      }
      const result = await propertyCollection.updateOne(query, updateProperty);
      res.send(result)

    })
    app.patch('/properties/verifiedStatus/:id', async (req, res) => {
      const { verified_status } = req.body;
      const query = { _id: new ObjectId(req.params.id) }
      const updateVerifiedStatus = {
        $set: {
          verified_status: verified_status
        }
      }
      const result = await propertyCollection.updateOne(query, updateVerifiedStatus)
      res.send(result)
    })

    // review related api
    app.post('/reviews', async (req, res) => {
      const reviews = req.body;
      const result = await reviewCollection.insertOne(reviews)
      res.send(result)
    })
    app.get('/allReviews', async (req, res) => {
      const result = await reviewCollection.find().sort({ reviewTime: -1 }).toArray()
      res.send(result)
    })
    app.get('/userMyReviews/:email', async (req, res) => {
      const email = req.params.email;
      const query = { reviewerEmail: email }
      const result = await reviewCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/singleReviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { propertyId: id }
      const result = await reviewCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/reviews/:propertyTitle', async (req, res) => {
      const reviews = req.params.propertyTitle;
      const query = { propertyTitle: reviews }
      const result = await reviewCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })

    // wishlist related api
    app.post('/wishlist', async (req, res) => {
      const wishlist = req.body;
      const isExisting = await wishListCollection.findOne({
        wishlistId: wishlist.wishlistId,
        wishlisterEmail: wishlist.wishlisterEmail
      })
      if (isExisting) {
        return res.send({ message: 'Already added this property', insertedId: null });
      }
      const result = await wishListCollection.insertOne(wishlist)
      res.send(result)
    })
    app.get('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const wishlistItem = await wishListCollection.findOne(query)
      const priceRange = wishlistItem.priceRange;
      const [minPrice, maxPrice] = priceRange.split('-').map(price => parseFloat(price.replace(/,/g, '')));
      const result = {
        ...wishlistItem,
        priceRange: [minPrice, maxPrice],
      };
      res.send(result);
    })
    app.get('/allWishlist/:wishListerEmail', async (req, res) => {
      const email = req.params.wishListerEmail;
      const query = { wishlisterEmail: email }
      const result = await wishListCollection.find(query).toArray()
      res.send(result)
    })
    app.delete('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await wishListCollection.deleteOne(query)
      res.send(result)
    })

    // user property brought related api
    app.post('/propertyBrought', async (req, res) => {
      const bought = req.body;
      const isExisting = await propertyBroughtCollection.findOne({
        wishlistId: bought.wishlistId,
        buyerEmail: bought.buyerEmail
      })
      if(isExisting){
        return res.send({message:'Property already offered',insertedId:null})
      }
      const result = await propertyBroughtCollection.insertOne(bought)
      res.send(result)
    })
    app.get('/propertyBrought/:email', async (req, res) => {
      const email = req.params.email;
      const query = { buyerEmail: email }
      const result = await propertyBroughtCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/requestedProperties/:email', async (req, res) => {
      const email = req.params.email;
      const query = { agentEmail: email }
      const result = await propertyBroughtCollection.find(query).toArray();
      res.send(result)
    })
    // update multiple data status
    app.put('/api/request/:requestId',async(req,res)=>{
      const {status} = req.body;
      const requestId = req.params.requestId;
      const query = {_id: new ObjectId (requestId)}
      const acceptedRequest = await propertyBroughtCollection.findOne (query);
      const updateAcceptedStatus = {
        $set:{
          status: status
        }
      }
      const accptedResult = await propertyBroughtCollection.updateOne(query,updateAcceptedStatus);
      const rejectQuery = {wishlistId: acceptedRequest.wishlistId,_id: { $ne: new ObjectId(requestId) }}
      const updateRejectedStatus = {
        $set:{
          status: "rejected"
        }
      }
      const rejectedResult = await propertyBroughtCollection.updateMany(rejectQuery,updateRejectedStatus)
      res.send({accptedResult,rejectedResult})
     
    })
    // update reject
    

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