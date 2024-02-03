const express = require("express");
const propertyBoughtPostController = require("../../controllers/PropertyBoughtController/propertyBoughtPostController");
const propertyBoughtGetByEmailController = require("../../controllers/PropertyBoughtController/propertyBoughtGetByEmailController");
const verifyToken = require("../../middleWare/VerifyToken");
const verifyAgent = require("../../middleWare/VerifyAgent");
const requestedPropertiesGetByEmailController = require("../../controllers/PropertyBoughtController/requestedPropertiesGetByEmailController");
const propertyBoughtGetByIdController = require("../../controllers/PropertyBoughtController/propertyBoughtGetByIdController");
const propertyBoughtRequestPutController = require("../../controllers/PropertyBoughtController/propertyBoughtRequestPutController");
const propertyBoughtRejectStatusPutController = require("../../controllers/PropertyBoughtController/propertyBoughtRejectStatusPutController");
const propertyBoughtRouter = express.Router()

    // user property brought related api
    propertyBoughtRouter.post('/propertyBrought', propertyBoughtPostController);

    propertyBoughtRouter.get('/propertyBrought/:email', propertyBoughtGetByEmailController);

    propertyBoughtRouter.get('/requestedProperties/:email', verifyToken, verifyAgent, requestedPropertiesGetByEmailController);

    propertyBoughtRouter.get('/propertyBought/:id', propertyBoughtGetByIdController);

    // Update multiple user request status
    propertyBoughtRouter.put('/api/request/:requestId', verifyToken, verifyAgent, propertyBoughtRequestPutController);

    // Update user reject status
    propertyBoughtRouter.patch('/api/reject/:requestId', verifyToken, verifyAgent,propertyBoughtRejectStatusPutController);

module.exports=propertyBoughtRouter;