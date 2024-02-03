const { ObjectId } = require("mongodb");
const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyGetByIdController = async (req, res) =>{


        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await propertyCollection.findOne(query);
          res.send(result);
        } catch (error) {
          console.error("Error getting single property:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports=propertyGetByIdController;