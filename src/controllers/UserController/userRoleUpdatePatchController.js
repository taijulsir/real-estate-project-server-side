const { ObjectId } = require("mongodb");
const { userCollection } = require("../../DatabaseConfig/connectMongodb");

const userRoleUpdatePatchController = async (req, res) => {
    
        try {
          const id = req.params.id;
          console.log(id)
          const query = { _id: new ObjectId(id) };
          console.log(query)
          const { role } = req.body;
          console.log(role)
          const updatedRole = {
            $set: {
              role: role
            }
          };
          const result = await userCollection.updateOne(query, updatedRole);
          console.log(result)
          res.send(result);
        } catch (error) {
          console.error("Error in /users/admin/:id endpoint:", error);
          res.status(500).send({ error: "Internal Server Error" });
        }
}

module.exports= userRoleUpdatePatchController;