const { propertyBroughtCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyBoughtGetByEmailController = () => {
    async (req, res) => {
        try {
          // Extracting email parameter from the request
          const email = req.params.email;
          const query = { buyerEmail: email };
  
          // Retrieving properties bought by the buyer
          const result = await propertyBroughtCollection.find(query).toArray();
          res.send(result);
        } catch (error) {
          // Handling errors
          console.error('Error in /propertyBrought/:email:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      }
}

module.exports=propertyBoughtGetByEmailController;