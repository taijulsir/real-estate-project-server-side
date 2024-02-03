const { userCollection } = require("../DatabaseConfig/connectMongodb");

    // check agent 
    const verifyAgent = async (req, res, next) => {
      try {
        const email = req.decoded.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        const isAgent = user?.role === "agent";
        if (isAgent) {
          next();
        } else {
          return res.status(403).send({ message: "Forbidden access" });
        }
      } catch (error) {
        console.error("Error in verifyAgent middleware:", error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    };

module.exports=verifyAgent;