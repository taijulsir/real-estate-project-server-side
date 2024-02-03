const { reviewCollection } = require("../../DatabaseConfig/connectMongodb");

const reviewGetByUserEmailController =  async (req, res) => {
  
        try {
          const email = req.params.email;
          const query = { reviewerEmail: email };
          const result = await reviewCollection.find(query).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error fetching user reviews:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports=reviewGetByUserEmailController;