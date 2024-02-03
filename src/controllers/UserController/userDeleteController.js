const { ObjectId } = require("mongodb");
const { userCollection } = require("../../DatabaseConfig/connectMongodb");

const userDeleteController =  async (req, res) =>{
   
        try {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await userCollection.deleteOne(query);
          res.send(result);
        } catch (error) {
          console.error("Error in /users/:id endpoint:", error);
          res.status(500).send({ error: "Internal Server Error" });
        }
      
}

module.exports=userDeleteController;