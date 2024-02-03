const { ObjectId } = require("mongodb");
const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyUpdateByAgentController = async (req, res) => {

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
      
}

module.exports=propertyUpdateByAgentController;