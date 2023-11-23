const express = require("express")
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


app.get("/", async (req, res) => {
    try {
        res.send("The real estate project server is running")
    }
    catch (error) {
        res.status(500).send({ error: error })
    }
})
app.listen(port,()=>{
    console.log(`Real estate project server is running on port ${port}`)
})