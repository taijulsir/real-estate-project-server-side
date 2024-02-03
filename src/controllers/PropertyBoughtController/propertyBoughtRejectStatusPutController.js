const { ObjectId } = require("mongodb");
const { propertyBroughtCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyBoughtRejectStatusPutController = async (req, res) => {
     
        try {
          // Extracting data from the request
          const { status } = req.body;
          const requestId = req.params.requestId;
          const query = { _id: new ObjectId(requestId) };
  
          // Updating the rejected request status
          const updateRejectedStatus = {
            $set: {
              status: status
            }
          };
          const rejectResult = await propertyBroughtCollection.updateOne(query, updateRejectedStatus);
  
          res.send(rejectResult);
        } catch (error) {
          // Handling errors
          console.error('Error in /api/reject/:requestId:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      
}

module.exports= propertyBoughtRejectStatusPutController;