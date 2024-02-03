const { userCollection } = require("../DatabaseConfig/connectMongodb");

    const verifyAdmin = async (req, res, next) => {
      try {
        console.log('This is admin', req.decoded.email);
        const email = req.decoded.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        const isAdmin = user?.role === "admin";
        if (isAdmin) {
          next();
        } else {
          return res.status(403).send({ message: "Forbidden access" });
        }
      } catch (error) {
        console.error("Error in verifyAdmin middleware:", error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    };

module.exports=verifyAdmin;