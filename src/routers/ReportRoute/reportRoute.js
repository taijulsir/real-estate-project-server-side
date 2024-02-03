const express = require("express")
const reportPostController = require("../../controllers/ReportController/reportPostController")
const reportGetController = require("../../controllers/ReportController/reportGetController")
const reportedPropertiesUpdateAndDeleteController = require("../../controllers/ReportController/reportPropertiesUpdateAndDeleteController")
const reportRouter = express.Router()

    // report related api

    // Api to insert reported Properties
    reportRouter.post('/reportedProperties', reportPostController)

    // Api to get reported properties
    reportRouter.get('/reportedProperties', reportGetController)

    // Api to updte reported properties and delete properties
    reportRouter.patch('/reportedProperties/:id', reportedPropertiesUpdateAndDeleteController)

module.exports=reportRouter;