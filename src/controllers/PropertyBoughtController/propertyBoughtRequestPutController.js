const { ObjectId } = require("mongodb");
const { propertyBroughtCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyBoughtRequestPutController = () => {
    async (req, res) => {
        try {
          // Extracting data from the request
          const { status } = req.body;
          const requestId = req.params.requestId;
          const query = { _id: new ObjectId(requestId) };
  
          // Retrieving the accepted request
          const acceptedRequest = await propertyBroughtCollection.findOne(query);
  
          // Updating the accepted request status
          const updateAcceptedStatus = {
            $set: {
              status: status
            }
          };
          const accptedResult = await propertyBroughtCollection.updateOne(query, updateAcceptedStatus);
  
          // Updating the status of other requests with the same wishlistId
          const rejectQuery = { wishlistId: acceptedRequest.wishlistId, _id: { $ne: new ObjectId(requestId) } };
          const updateRejectedStatus = {
            $set: {
              status: 'rejected'
            }
          };
          const rejectedResult = await propertyBroughtCollection.updateMany(rejectQuery, updateRejectedStatus);
  
          res.send({ accptedResult, rejectedResult });
        } catch (error) {
          // Handling errors
          console.error('Error in /api/request/:requestId:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      }
}


module.exports=propertyBoughtRequestPutController;