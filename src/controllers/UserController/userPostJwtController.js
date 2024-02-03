const jwt = require("jsonwebtoken");
const { acces_token_secret } = require("../../secret");

const userPostJwtControllers = async (req, res) => {
 
        try {
          const user = req.body;
          const token = jwt.sign(user, acces_token_secret, {
            expiresIn: '1h'
          });
          res.send({ token });
        } catch (error) {
          console.error("Error in /jwt endpoint:", error);
          res.status(500).send({ error: "Internal Server Error" });
        }
      
}

module.exports=userPostJwtControllers;