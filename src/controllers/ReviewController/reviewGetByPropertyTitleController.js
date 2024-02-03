const { reviewCollection } = require("../../DatabaseConfig/connectMongodb");

const reveiwGetByPropertyTitleController = async (req, res) => {
   
        try {
          const reviews = req.params.propertyTitle;
          const query = { propertyTitle: reviews };
          const result = await reviewCollection.find(query).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error fetching reviews by title:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports=reveiwGetByPropertyTitleController;