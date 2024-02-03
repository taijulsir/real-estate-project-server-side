const express = require("express")
const cors = require("cors")
const app = express();
const morgan = require("morgan");


// all router 
const wishlistRouter = require("./routers/WishlistRoute/wishlistRoute");
const userRouter = require("./routers/UserRoute/userRoute");
const propertyRouter = require("./routers/PropertyRoute/propertyRoute");
const propertyBoughtRouter = require("./routers/PropertyBoughtRoute/proertyBoughtRoute");
const reviewRouter = require("./routers/ReviewRoute/reviewRoute");
const reportRouter = require("./routers/ReportRoute/reportRoute");
const paymentRouter = require("./routers/PaymentRoute/paymentRoute");

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))

// user route
app.use('/api/v1', userRouter)

// property route
app.use('/api/v1',propertyRouter)

// property bought route
app.use('/api/v1',propertyBoughtRouter)

// wishlist route
app.use('/api/v1',wishlistRouter)

// review route
app.use('/api/v1',reviewRouter)

// report route
app.use('/api/v1',reportRouter)

// payment route
app.use('/api/v1',paymentRouter)


module.exports = app;
