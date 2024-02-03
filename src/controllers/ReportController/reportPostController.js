const { reportCollection } = require("../../DatabaseConfig/connectMongodb");

const reportPostController = async (req, res) => {
     
        try {
          const report = req.body;
          const result = await reportCollection.insertOne(report)
          res.send(result)
        }
        catch (error) {
          console.error("Error in inserting reported Property", error)
          res.status(500).send("Internal Server Error")
        }
      
}

module.exports=reportPostController;