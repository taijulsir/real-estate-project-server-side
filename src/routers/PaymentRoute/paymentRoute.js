const express = require ("express");
const paymentPostIntentController = require("../../controllers/PaymentController/paymentPostIntentController");
const updatePaymentStatusAndPostPaymentController = require("../../controllers/PaymentController/UpdatePaymentStatusAndPostPaymentController");
const verifyToken = require("../../middleWare/VerifyToken");
const verifyAgent = require("../../middleWare/VerifyAgent");
const paymentHistoryGetController = require("../../controllers/PaymentController/PaymentHistoryGetController");
const paymentRouter = express.Router()

    // Payment Related API: Create Payment Intent
    paymentRouter.post('/create-payment-intent',paymentPostIntentController);

    // Payment API: Update Payment Status and Record Payment
    paymentRouter.post('/payments',updatePaymentStatusAndPostPaymentController);

    // Payment History API: Retrieve Payments by Agent Email
    paymentRouter.get('/payments/:email', verifyToken, verifyAgent, paymentHistoryGetController);
   
   
   
module.exports=paymentRouter;