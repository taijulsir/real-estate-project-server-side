const { ObjectId } = require("mongodb");
const { userCollection, propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const userFraudAgentPatchController = async (req, res) =>{
  
        try {
          const { status } = req.body;
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const updateStatus = {
            $set: {
              status: status
            }
          };
          const statusResult = await userCollection.updateOne(query, updateStatus);
          const updatedUser = await userCollection.findOne(query);
          const fraudEmail = { agentEmail: updatedUser.email };
          const deletedPropertiesResult = await propertyCollection.deleteMany(fraudEmail);
          res.send({ statusResult, deletedPropertiesResult });
        } catch (error) {
          console.error("Error in /users/fraud/:id endpoint:", error);
          res.status(500).send({ error: "Internal Server Error" });
        }
      
}

module.exports=userFraudAgentPatchController;