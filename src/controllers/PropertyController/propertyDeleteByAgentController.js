const { ObjectId } = require("mongodb");
const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyDeleteByAgentController = async (req, res) => {
 
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await propertyCollection.deleteOne(query);
          res.send(result);
        } catch (error) {
          console.error("Error deleting property:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports=propertyDeleteByAgentController;