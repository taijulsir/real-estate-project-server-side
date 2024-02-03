const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyVerifiedGetController =async (req, res) => {
    
        try {
          const filters = { verified_status: 'verified' };
          const result = await propertyCollection.find(filters).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error getting verified and filtered properties:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports = propertyVerifiedGetController;