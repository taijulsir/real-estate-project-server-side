const { reportCollection } = require("../../DatabaseConfig/connectMongodb")

const reportGetController =  async (req, res) => {
 
        try {
          const result = await reportCollection.find().toArray()
          res.send(result)
        }
        catch (error) {
          console.error('Error occured in get reportedProperties', error)
          res.status(500).send("Internal Server Error")
        }
      
}

module.exports=reportGetController;