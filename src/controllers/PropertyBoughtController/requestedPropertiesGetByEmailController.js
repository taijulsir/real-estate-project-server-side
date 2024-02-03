const { propertyBroughtCollection } = require("../../DatabaseConfig/connectMongodb");

const requestedPropertiesGetByEmailController = async (req, res) => {
     
        try {
          // Extracting email parameter from the request
          const email = req.params.email;
          const query = { agentEmail: email };
  
          // Retrieving properties requested by the agent
          const result = await propertyBroughtCollection.find(query).toArray();
          res.send(result);
        } catch (error) {
          // Handling errors
          console.error('Error in /requestedProperties/:email:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      
}
module.exports=requestedPropertiesGetByEmailController;