const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const allPropertyGetController =  async (req, res)  => {
   
        try {
          const result = await propertyCollection.find().toArray();
          res.send(result);
        } catch (error) {
          console.error("Error getting all properties:", error);
          res.status(500).send("Internal Server Error");
        }   
}

module.exports=allPropertyGetController;