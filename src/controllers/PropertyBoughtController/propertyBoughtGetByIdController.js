const { ObjectId } = require("mongodb");
const { propertyBroughtCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyBoughtGetByIdController =  async (req, res) => {
     
        try {
          // Extracting id parameter from the request
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
  
          // Retrieving a specific property by ID
          const result = await propertyBroughtCollection.findOne(query);
          res.send(result);
        } catch (error) {
          // Handling errors
          console.error('Error in /propertyBought/:id:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      
}

module.exports=propertyBoughtGetByIdController;