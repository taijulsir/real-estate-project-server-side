const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyPostController = async (req, res) =>{
     
        try {
          const properties = req.body;
          const result = await propertyCollection.insertOne(properties);
          res.send(result);
        } catch (error) {
          console.error("Error creating property:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports=propertyPostController;