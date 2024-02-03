const { reviewCollection } = require("../../DatabaseConfig/connectMongodb");

const singleReviewsGetByIdController = () => {
    async (req, res) => {
        try {
          const id = req.params.id;
          const query = { propertyId: id };
          const result = await reviewCollection.find(query).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error fetching reviews by ID:", error);
          res.status(500).send("Internal Server Error");
        }
      }
}

module.exports = singleReviewsGetByIdController;