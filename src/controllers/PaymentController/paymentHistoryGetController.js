const { paymentCollection } = require("../../DatabaseConfig/connectMongodb");

const paymentHistoryGetController =  async (req, res) => {
    
        try {
          const email = req.params.email;
  
          // Querying payment collection for payments associated with the agent's email
          const query = { agentEmail: email };
          const result = await paymentCollection.find(query).toArray();
  
          // Sending the payment history back to the client
          res.send(result);
        } catch (error) {
          // Handling errors during payment history retrieval
          console.error('Error retrieving payment history:', error.message);
          res.status(500).send({ error: 'Error retrieving payment history' });
        }
      
}

module.exports=paymentHistoryGetController;
