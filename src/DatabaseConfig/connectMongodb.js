const { MongoClient, ServerApiVersion } = require("mongodb");
const { databaseUrl } = require("../secret");

const client = new MongoClient(databaseUrl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const connectWithMongoDB = async () => {
    try {
        console.log("Mongodb Connected successfully")
    }
    catch (error) {
        console.error("Error on connecting mongodb", error.message)
    }
}

    const userCollection = client.db('realEstateDB').collection('users')
    const propertyCollection = client.db('realEstateDB').collection('properties')
    const reviewCollection = client.db('realEstateDB').collection('reviews')
    const reportCollection = client.db('realEstateDB').collection('report')
    const wishListCollection = client.db('realEstateDB').collection('wishlist')
    const propertyBroughtCollection = client.db('realEstateDB').collection('propertyBrought')
    const paymentCollection = client.db('realEstateDB').collection('payments')


module.exports = {connectWithMongoDB,userCollection,propertyCollection,reviewCollection,reportCollection,wishListCollection,propertyBroughtCollection,reportCollection,paymentCollection}

