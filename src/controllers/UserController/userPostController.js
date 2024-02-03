const { userCollection } = require("../../DatabaseConfig/connectMongodb");

const userPostController =  async (req, res) => {
    
        try {
          const user = req.body;
          const query = { email: user?.email };
          const isExisting = await userCollection.findOne(query);
  
          if (isExisting) {
            return res.send({ message: "User already exists", insertedId: null });
          }
  
          const result = await userCollection.insertOne(user);
          res.send(result);
        }  
        catch (error) {
          console.error("Error in /users endpoint:", error);
          res.status(500).send({ error: "Internal Server Error" });
        }
      
}

module.exports=userPostController;