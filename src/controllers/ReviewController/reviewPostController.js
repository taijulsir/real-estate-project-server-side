const { reviewCollection } = require("../../DatabaseConfig/connectMongodb");

const reviewPostController = async (req, res) => {
     
        try {
          const reviews = req.body;
          const result = await reviewCollection.insertOne(reviews);
          res.send(result);
        } catch (error) {
          console.error("Error adding review:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports= reviewPostController;