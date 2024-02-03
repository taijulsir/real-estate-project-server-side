const { stripe_secret_key } = require("../../secret");

const stripe = require("stripe")(stripe_secret_key)

const paymentPostIntentController =  async (req, res) => {
   
        try {
          // Extracting price from the request body
          const { price } = req.body;
  
          // Converting price to cents
          const amount = parseInt(price * 100);
          console.log(amount, 'amount inside the intent');
  
          // Creating a payment intent using the Stripe API
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card']
          });
  
          // Sending the client secret back to the client
          res.send({
            clientSecret: paymentIntent.client_secret
          });
        } catch (error) {
          // Handling errors during payment intent creation
          console.error('Error creating payment intent:', error.message);
          res.status(500).send({ error: 'Error creating payment intent' });
        }
      
}

module.exports=paymentPostIntentController;