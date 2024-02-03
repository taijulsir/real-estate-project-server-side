const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const advertisePropertyGetController =  async (req, res) => {

   
        try {
          const advertise = { advertise: 'advertise' };
          const result = await propertyCollection.find(advertise).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error getting advertised properties:", error);
          res.status(500).send("Internal Server Error");
        }
      
}

module.exports=advertisePropertyGetController;