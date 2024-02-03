const { reviewCollection } = require("../../DatabaseConfig/connectMongodb");

const allReviewGetController =  async (req, res) => {

        try {
          const result = await reviewCollection.find().sort({ reviewTime: -1 }).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports = allReviewGetController;