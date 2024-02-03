const { propertyBroughtCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyBoughtPostController =  async (req, res) => {
    
        try {
          // Extracting data from the request body
          const bought = req.body;
  
          // Checking if the property already exists
          const isExisting = await propertyBroughtCollection.findOne({
            wishlistId: bought.wishlistId,
            buyerEmail: bought.buyerEmail
          });
  
          if (isExisting) {
            return res.send({ message: 'Property already offered', insertedId: null });
          }
  
          // Inserting the new property
          const result = await propertyBroughtCollection.insertOne(bought);
          res.send(result);
        } catch (error) {
          // Handling errors
          console.error('Error in /propertyBrought:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      
}

module.exports=propertyBoughtPostController;