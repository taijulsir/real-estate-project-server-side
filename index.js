const express = require("express")
const app = express()
require("dotenv").config();
const cors = require('cors')
const jwt = require('jsonwebtoken')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
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
    const reportCollection = client.db('realEstateDB').collection('report')
    const wishListCollection = client.db('realEstateDB').collection('wishlist')
    const propertyBroughtCollection = client.db('realEstateDB').collection('propertyBrought')
    const paymentCollection = client.db('realEstateDB').collection('payments')

    // middlewares verify token
    const verifyToken = async (req, res, next) => {
      try {
        if (!req.headers.authorization) {
          return res.status(401).send({ message: "Unauthorized access" });
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).send({ message: "Unauthorized access" });
          }
          req.decoded = decoded;
          next();
        });
      } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    };

    // check admin 
    const verifyAdmin = async (req, res, next) => {
      try {
        console.log('This is admin', req.decoded.email);
        const email = req.decoded.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        const isAdmin = user?.role === "admin";
        if (isAdmin) {
          next();
        } else {
          return res.status(403).send({ message: "Forbidden access" });
        }
      } catch (error) {
        console.error("Error in verifyAdmin middleware:", error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    };

    // check agent 
    const verifyAgent = async (req, res, next) => {
      try {
        console.log('This is agent', req.decoded.email);
        const email = req.decoded.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        const isAgent = user?.role === "agent";
        if (isAgent) {
          next();
        } else {
          return res.status(403).send({ message: "Forbidden access" });
        }
      } catch (error) {
        console.error("Error in verifyAgent middleware:", error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    };


    // JWT related API
    app.post('/jwt', async (req, res) => {
      try {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '1h'
        });
        res.send({ token });
      } catch (error) {
        console.error("Error in /jwt endpoint:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // User related API - Create user
    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user?.email };
        const isExisting = await userCollection.findOne(query);

        if (isExisting) {
          return res.send({ message: "User already exists", insertedId: null });
        }

        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error("Error in /users endpoint:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // Check admin or agent
    app.get('/users/checkRole/:email', verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        if (email !== req.decoded.email) {
          return res.status(403).send({ message: "Forbidden Access" });
        }
        const query = { email: email };
        const user = await userCollection.findOne(query);
        let roleInfo = {
          admin: false,
          agent: false,
        };
        if (user) {
          roleInfo.admin = user.role === 'admin';
          roleInfo.agent = user.role === 'agent';
        }
        res.send({ roleInfo });
      } catch (error) {
        console.error("Error in /users/checkRole/:email endpoint:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // User related API - Get all users
    app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await userCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error in /users endpoint:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // User related API - Delete user
    app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error in /users/:id endpoint:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // Update user role
    app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const { role } = req.body;
        const updatedRole = {
          $set: {
            role: role
          }
        };
        const result = await userCollection.updateOne(query, updatedRole);
        res.send(result);
      } catch (error) {
        console.error("Error in /users/admin/:id endpoint:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // Handle fraud agent
    app.patch('/users/fraud/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { status } = req.body;
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateStatus = {
          $set: {
            status: status
          }
        };
        const statusResult = await userCollection.updateOne(query, updateStatus);
        const updatedUser = await userCollection.findOne(query);
        const fraudEmail = { agentEmail: updatedUser.email };
        const deletedPropertiesResult = await propertyCollection.deleteMany(fraudEmail);
        res.send({ statusResult, deletedPropertiesResult });
      } catch (error) {
        console.error("Error in /users/fraud/:id endpoint:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });


    // properties related api
    // Create a new property
    app.post('/properties', async (req, res) => {
      try {
        const properties = req.body;
        const result = await propertyCollection.insertOne(properties);
        res.send(result);
      } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Get verified and filtered properties
    app.get('/properties/verified/filtered', async (req, res) => {
      try {
        const filters = { verified_status: 'verified' };
        const result = await propertyCollection.find(filters).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error getting verified and filtered properties:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Get all properties (admin only)
    app.get('/manageProperties', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await propertyCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error getting all properties:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Advertise a property (admin only)
    app.patch('/advertiseProperties/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { advertise } = req.body;
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateAdvertise = {
          $set: {
            advertise: advertise
          }
        };
        const result = await propertyCollection.updateOne(query, updateAdvertise);
        res.send(result);
      } catch (error) {
        console.error("Error advertising property:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Get advertised properties
    app.get('/advertiseProperties', async (req, res) => {
      try {
        const advertise = { advertise: 'advertise' };
        const result = await propertyCollection.find(advertise).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error getting advertised properties:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Get properties by agent (agent only)
    app.get('/agentProperties/:email', verifyToken, verifyAgent, async (req, res) => {
      try {
        const email = req.params.email;
        const query = { agentEmail: email };
        const result = await propertyCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error getting agent properties:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Get a single property by ID
    app.get('/singleProperties/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await propertyCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error getting single property:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Delete a property (agent only)
    app.delete('/properties/:id', verifyToken, verifyAgent, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await propertyCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Update a property (agent only)
    app.patch('/properties/:id', verifyToken, verifyAgent, async (req, res) => {
      try {
        const property = req.body;
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateProperty = {
          $set: {
            propertyImage: property.propertyImage,
            propertyTitle: property.propertyTitle,
            propertyLocation: property.propertyLocation,
            priceRange: property.priceRange
          }
        };
        const result = await propertyCollection.updateOne(query, updateProperty);
        res.send(result);
      } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Update verified status of a property (admin only)
    app.patch('/properties/verifiedStatus/:id', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { verified_status } = req.body;
        const query = { _id: new ObjectId(req.params.id) };
        const updateVerifiedStatus = {
          $set: {
            verified_status: verified_status
          }
        };
        const result = await propertyCollection.updateOne(query, updateVerifiedStatus);
        res.send(result);
      } catch (error) {
        console.error("Error updating verified status of property:", error);
        res.status(500).send("Internal Server Error");
      }
    });


    // review related api
    // API to add a new review
    app.post('/reviews', async (req, res) => {
      try {
        const reviews = req.body;
        const result = await reviewCollection.insertOne(reviews);
        res.send(result);
      } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // API to manage reviews (accessible only to admin after token verification)
    app.get('/manageReviews', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const result = await reviewCollection.find().sort({ reviewTime: -1 }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // API to get all reviews
    app.get('/allReviews', async (req, res) => {
      try {
        const result = await reviewCollection.find().sort({ reviewTime: -1 }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // API to get reviews by user email
    app.get('/userMyReviews/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { reviewerEmail: email };
        const result = await reviewCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // API to get reviews by property ID
    app.get('/singleReviews/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { propertyId: id };
        const result = await reviewCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching reviews by ID:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // API to get reviews by property title
    app.get('/reviews/:propertyTitle', async (req, res) => {
      try {
        const reviews = req.params.propertyTitle;
        const query = { propertyTitle: reviews };
        const result = await reviewCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching reviews by title:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // API to delete a review by ID
    app.delete('/reviews/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).send("Internal Server Error");
      }
    });


    // report related api

    // Api to insert reported Properties
    app.post('/reportedProperties', async (req, res) => {
      try {
        const report = req.body;
        const result = await reportCollection.insertOne(report)
        res.send(result)
      }
      catch (error) {
        console.error("Error in inserting reported Property", error)
        res.status(500).send("Internal Server Error")
      }
    })

    app.get('/reportedProperties', async (req, res) => {
      try {
        const result = await reportCollection.find().toArray()
        res.send(result)
      }
      catch (error) {
        console.error('Error occured in get reportedProperties', error)
        res.status(500).send("Internal Server Error")
      }
    })

    app.patch('/reportedProperties/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { status, propertyId } = req.body;
        const query = { _id: new ObjectId(id) }
        const updateReportStatus = {
          $set: {
            status: status
          }
        }
        const updateResult = await reportCollection.updateOne(query,updateReportStatus)
        const propertyQuery = { _id: new ObjectId(propertyId) }
        const deleteProperty = await propertyCollection.deleteOne(propertyQuery)
        const reviewquery = {propertyId: propertyId}
        const deleteReview = await reviewCollection.deleteMany(reviewquery)
        res.send({ updateResult, deleteProperty, deleteReview })
      }
      catch (error) {
        console.error('Error occured in get reportedProperties', error)
        res.status(500).send("Internal Server Error")
      }
    })


    // wishlist related api

    // Create or update a wishlist item
    app.post('/wishlist', async (req, res) => {
      try {
        const wishlist = req.body;

        // Check if the wishlist item already exists
        const isExisting = await wishListCollection.findOne({
          wishlistId: wishlist.wishlistId,
          wishlisterEmail: wishlist.wishlisterEmail
        });

        if (isExisting) {
          // Wishlist item already exists, send a message
          return res.send({ message: 'Already added this property', insertedId: null });
        }

        // Insert the new wishlist item
        const result = await wishListCollection.insertOne(wishlist);
        res.send(result);
      } catch (error) {
        // Handle errors
        console.error('Error in /wishlist POST:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Get a specific wishlist item by ID
    app.get('/wishlist/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        // Find the wishlist item by ID
        const wishlistItem = await wishListCollection.findOne(query);

        // Extract and format price range
        const priceRange = wishlistItem.priceRange;
        const [minPrice, maxPrice] = priceRange.split('-').map(price => parseFloat(price.replace(/,/g, '')));

        const result = {
          ...wishlistItem,
          priceRange: [minPrice, maxPrice],
        };

        res.send(result);
      } catch (error) {
        // Handle errors
        console.error('Error in /wishlist/:id GET:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Get all wishlist items for a specific wishlister
    app.get('/allWishlist/:wishListerEmail', async (req, res) => {
      try {
        const email = req.params.wishListerEmail;
        const query = { wishlisterEmail: email };

        // Find all wishlist items for the specified wishlister
        const result = await wishListCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        // Handle errors
        console.error('Error in /allWishlist/:wishListerEmail GET:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Delete a wishlist item by ID
    app.delete('/wishlist/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        // Delete the wishlist item by ID
        const result = await wishListCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        // Handle errors
        console.error('Error in /wishlist/:id DELETE:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });



    // user property brought related api
    app.post('/propertyBrought', async (req, res) => {
      try {
        // Extracting data from the request body
        const bought = req.body;

        // Checking if the property already exists
        const isExisting = await propertyBroughtCollection.findOne({
          wishlistId: bought.wishlistId,
          buyerEmail: bought.buyerEmail
        });

        if (isExisting) {
          return res.send({ message: 'Property already offered', insertedId: null });
        }

        // Inserting the new property
        const result = await propertyBroughtCollection.insertOne(bought);
        res.send(result);
      } catch (error) {
        // Handling errors
        console.error('Error in /propertyBrought:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    app.get('/propertyBrought/:email', async (req, res) => {
      try {
        // Extracting email parameter from the request
        const email = req.params.email;
        const query = { buyerEmail: email };

        // Retrieving properties bought by the buyer
        const result = await propertyBroughtCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        // Handling errors
        console.error('Error in /propertyBrought/:email:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    app.get('/requestedProperties/:email', verifyToken, verifyAgent, async (req, res) => {
      try {
        // Extracting email parameter from the request
        const email = req.params.email;
        const query = { agentEmail: email };

        // Retrieving properties requested by the agent
        const result = await propertyBroughtCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        // Handling errors
        console.error('Error in /requestedProperties/:email:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    app.get('/propertyBought/:id', async (req, res) => {
      try {
        // Extracting id parameter from the request
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        // Retrieving a specific property by ID
        const result = await propertyBroughtCollection.findOne(query);
        res.send(result);
      } catch (error) {
        // Handling errors
        console.error('Error in /propertyBought/:id:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Update multiple user request status
    app.put('/api/request/:requestId', verifyToken, verifyAgent, async (req, res) => {
      try {
        // Extracting data from the request
        const { status } = req.body;
        const requestId = req.params.requestId;
        const query = { _id: new ObjectId(requestId) };

        // Retrieving the accepted request
        const acceptedRequest = await propertyBroughtCollection.findOne(query);

        // Updating the accepted request status
        const updateAcceptedStatus = {
          $set: {
            status: status
          }
        };
        const accptedResult = await propertyBroughtCollection.updateOne(query, updateAcceptedStatus);

        // Updating the status of other requests with the same wishlistId
        const rejectQuery = { wishlistId: acceptedRequest.wishlistId, _id: { $ne: new ObjectId(requestId) } };
        const updateRejectedStatus = {
          $set: {
            status: 'rejected'
          }
        };
        const rejectedResult = await propertyBroughtCollection.updateMany(rejectQuery, updateRejectedStatus);

        res.send({ accptedResult, rejectedResult });
      } catch (error) {
        // Handling errors
        console.error('Error in /api/request/:requestId:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Update user reject status
    app.patch('/api/reject/:requestId', verifyToken, verifyAgent, async (req, res) => {
      try {
        // Extracting data from the request
        const { status } = req.body;
        const requestId = req.params.requestId;
        const query = { _id: new ObjectId(requestId) };

        // Updating the rejected request status
        const updateRejectedStatus = {
          $set: {
            status: status
          }
        };
        const rejectResult = await propertyBroughtCollection.updateOne(query, updateRejectedStatus);

        res.send(rejectResult);
      } catch (error) {
        // Handling errors
        console.error('Error in /api/reject/:requestId:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Payment Related API: Create Payment Intent
    app.post('/create-payment-intent', async (req, res) => {
      try {
        // Extracting price from the request body
        const { price } = req.body;

        // Converting price to cents
        const amount = parseInt(price * 100);
        console.log(amount, 'amount inside the intent');

        // Creating a payment intent using the Stripe API
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method_types: ['card']
        });

        // Sending the client secret back to the client
        res.send({
          clientSecret: paymentIntent.client_secret
        });
      } catch (error) {
        // Handling errors during payment intent creation
        console.error('Error creating payment intent:', error.message);
        res.status(500).send({ error: 'Error creating payment intent' });
      }
    });

    // Payment API: Update Payment Status and Record Payment
    app.post('/payments', async (req, res) => {
      try {
        const payment = req.body;

        // Updating the status of the property purchase
        const boughtStatus = { _id: new ObjectId(payment.paymentId) };
        const updateStatus = {
          $set: {
            status: 'Bought',
            transactionId: payment.transjectionId
          }
        };
        const status = await propertyBroughtCollection.updateOne(boughtStatus, updateStatus);

        // Inserting payment record into the collection
        const result = await paymentCollection.insertOne(payment);

        // Sending the result and status back to the client
        res.send({ result, status });
      } catch (error) {
        // Handling errors during payment update or record insertion
        console.error('Error processing payment:', error.message);
        res.status(500).send({ error: 'Error processing payment' });
      }
    });

    // Payment History API: Retrieve Payments by Agent Email
    app.get('/payments/:email', verifyToken, verifyAgent, async (req, res) => {
      try {
        const email = req.params.email;

        // Querying payment collection for payments associated with the agent's email
        const query = { agentEmail: email };
        const result = await paymentCollection.find(query).toArray();

        // Sending the payment history back to the client
        res.send(result);
      } catch (error) {
        // Handling errors during payment history retrieval
        console.error('Error retrieving payment history:', error.message);
        res.status(500).send({ error: 'Error retrieving payment history' });
      }
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Default Route: Check Server Status
app.get("/", async (req, res) => {
  try {
    // Sending a success message to indicate that the server is running
    res.send("The real estate project server is running");
  } catch (error) {
    // Handling errors that might occur during server status check
    console.error('Error checking server status:', error.message);
    res.status(500).send({ error: 'Error checking server status' });
  }
});

app.listen(port, () => {
  console.log(`Real estate project server is running on port ${port}`)
})