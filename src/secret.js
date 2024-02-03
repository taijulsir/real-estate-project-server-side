require("dotenv").config()

const portNumber = process.env.PORT || 5000;
const acces_token_secret = process.env.ACCESS_TOKEN_SECRET
const databaseUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.49cfwvw.mongodb.net/?retryWrites=true&w=majority`;
const stripe_secret_key= process.env.STRIPE_SECRET_KEY
module.exports = {portNumber,acces_token_secret,databaseUrl,stripe_secret_key}