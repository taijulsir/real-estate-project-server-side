const { userCollection } = require("../../DatabaseConfig/connectMongodb");

const userGetController =  async (req, res)  => {
   
        try {
          const result = await userCollection.find().toArray();
          res.send(result);
        } catch (error) {
          console.error("Error in /users endpoint:", error);
          res.status(500).send({ error: "Internal Server Error" });
        }
      
}

module.exports=userGetController;