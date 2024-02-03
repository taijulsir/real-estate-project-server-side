const { ObjectId } = require("mongodb");
const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyAdvertisePatchController =  async (req, res) => {
   
        try {
          const { advertise } = req.body;
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const updateAdvertise = {
            $set: {
              advertise: advertise
            }
          };
          const result = await propertyCollection.updateOne(query, updateAdvertise);
          res.send(result);
        } catch (error) {
          console.error("Error advertising property:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports=propertyAdvertisePatchController;