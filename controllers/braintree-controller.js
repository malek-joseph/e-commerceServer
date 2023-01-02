// Here are all the controllers "middleware functions" related to braintree
//---------------------------------------------------------------------------[Requirements]
// [Models] to get access to the dB, and search in it
const User = require("../models/user-model"); 
// [Tools]
//[Require braintree] && [use it] to [handle payment] >> [npm i braintree] 
const braintree = require('braintree')
// We know how to use braintree from the docs, we use gateWay to hold the headers that will help process the payment
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
// [Require .env file] to [access environment variables]
const dotenv = require("dotenv");
dotenv.config();
//------------------------------------------------------------------------------------[Logic]

exports.generateToken = (req, res) => {
  // We know how to use it online
  gateway.clientToken.generate({

  }, function (error, response) {
    if (error) {
      res.status(500).send(error)
    } else {
      res.send(response)
    }
  })
}

exports.processPayment = (req, res) => {
  let nonceFromClient = req.body.paymentMethodNonce
  let amountFromClient = req.body.amount
  //charge
  let newTransaction = gateway.transaction.sale({
    amount: amountFromClient,
    paymentMethodNonce: nonceFromClient,
    options: {
      submitForSettlement: true
    }
  }, (error, result) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.json(result )
    }
  });
};