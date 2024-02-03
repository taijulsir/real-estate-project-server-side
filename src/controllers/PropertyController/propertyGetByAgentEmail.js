const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyGetByAgentEmail = async (req, res) =>{
   
        try {
          const email = req.params.email;
          const query = { agentEmail: email };
          const result = await propertyCollection.find(query).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error getting agent properties:", error);
          res.status(500).send("Internal Server Error");
        }      
}

module.exports = propertyGetByAgentEmail;