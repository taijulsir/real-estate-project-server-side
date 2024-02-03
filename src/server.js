const { connectWithMongoDB } = require("./DatabaseConfig/connectMongodb");
const app = require("./app");
const { portNumber } = require("./secret");

app.get("/",async(req,res)=>{
    res.status(200).send({message:"The real estate server is running"})
})



app.listen(portNumber,async()=>{
    console.log(`The server is running on https://localhost:${portNumber}`)
    await connectWithMongoDB()
})