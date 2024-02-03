const { ObjectId } = require("mongodb");
const { reviewCollection } = require("../../DatabaseConfig/connectMongodb");

const reviewDeleteController = async (req, res) => {
  
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await reviewCollection.deleteOne(query);
          res.send(result);
        } catch (error) {
          console.error("Error deleting review:", error);
          res.status(500).send("Internal Server Error");
        }   
}

module.exports=reviewDeleteController;