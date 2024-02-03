const { ObjectId } = require("mongodb");
const { propertyBroughtCollection, paymentCollection } = require("../../DatabaseConfig/connectMongodb");

const updatePaymentStatusAndPostPaymentController = async (req, res) => {
  
        try {
          const payment = req.body;
  
          // Updating the status of the property purchase
          const boughtStatus = { _id: new ObjectId(payment.paymentId) };
          const updateStatus = {
            $set: {
              status: 'Bought',
              transactionId: payment.transjectionId
            }
          };
          const status = await propertyBroughtCollection.updateOne(boughtStatus, updateStatus);
  
          // Inserting payment record into the collection
          const result = await paymentCollection.insertOne(payment);
  
          // Sending the result and status back to the client
          res.send({ result, status });
        } catch (error) {
          // Handling errors during payment update or record insertion
          console.error('Error processing payment:', error.message);
          res.status(500).send({ error: 'Error processing payment' });
        }
      
}

module.exports=updatePaymentStatusAndPostPaymentController;