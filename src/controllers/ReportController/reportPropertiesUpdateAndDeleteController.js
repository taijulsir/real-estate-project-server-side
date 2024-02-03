const { ObjectId } = require("mongodb");
const { reportCollection, propertyCollection, reviewCollection } = require("../../DatabaseConfig/connectMongodb");

const reportedPropertiesUpdateAndDeleteController = async (req, res) => {

        try {
          const id = req.params.id;
          const { status, propertyId } = req.body;
          const query = { _id: new ObjectId(id) }
          const updateReportStatus = {
            $set: {
              status: status
            }
          }
          const updateResult = await reportCollection.updateOne(query,updateReportStatus)
          const propertyQuery = { _id: new ObjectId(propertyId) }
          const deleteProperty = await propertyCollection.deleteOne(propertyQuery)
          const reviewquery = {propertyId: propertyId}
          const deleteReview = await reviewCollection.deleteMany(reviewquery)
          res.send({ updateResult, deleteProperty, deleteReview })
        }
        catch (error) {
          console.error('Error occured in get reportedProperties', error)     
          res.status(500).send("Internal Server Error")
        }
      
}

module.exports=reportedPropertiesUpdateAndDeleteController;