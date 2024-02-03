const { ObjectId } = require("mongodb");
const { propertyCollection } = require("../../DatabaseConfig/connectMongodb");

const propertyStatusVerifiedController = async (req, res) => {

    try {
        const { verified_status } = req.body;
        const query = { _id: new ObjectId(req.params.id) };
        const updateVerifiedStatus = {
            $set: {
                verified_status: verified_status
            }
        };
        const result = await propertyCollection.updateOne(query, updateVerifiedStatus);
        res.send(result);
    }
    catch (error) {
        console.error("Error updating verified status of property:", error);
        res.status(500).send("Internal Server Error");
    }

}

module.exports = propertyStatusVerifiedController;