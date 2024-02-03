const jwt = require("jsonwebtoken")
const { acces_token_secret } = require("../secret");

    const verifyToken = async (req, res, next) => {
      try {
        if (!req.headers.authorization) {
          return res.status(401).send({ message: "Unauthorized access" });
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, acces_token_secret, (err, decoded) => {
          if (err) {
            return res.status(401).send({ message: "Unauthorized access" });
          }
          req.decoded = decoded;
          next();
        });
      } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    };

module.exports=verifyToken;