const { userCollection } = require("../../DatabaseConfig/connectMongodb");

const userRoleCheckController =   async (req, res) =>{
   
        try {
          const email = req.params.email;
          if (email !== req.decoded.email) {
            return res.status(403).send({ message: "Forbidden Access" });
          }
          const query = { email: email };
          const user = await userCollection.findOne(query);
          let roleInfo = {
            admin: false,
            agent: false,
          };
          if (user) {
            roleInfo.admin = user.role === 'admin';
            roleInfo.agent = user.role === 'agent';
          }
          res.send({ roleInfo });
        } 
        catch (error) {
          console.error("Error in /users/checkRole/:email endpoint:", error);
          res.status(500).send({ error: "Internal Server Error" });
        }
      
}

module.exports=userRoleCheckController;