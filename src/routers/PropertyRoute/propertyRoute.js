const express = require("express");
const propertyPostController = require("../../controllers/PropertyController/propertyPostController");
const propertyVerifiedGetController = require("../../controllers/PropertyController/propertyVerifiedGetController");
const allPropertyGetController = require("../../controllers/PropertyController/allPropertyGetController");
const verifyToken = require("../../middleWare/VerifyToken");
const verifyAdmin = require("../../middleWare/VerifyAdmin");
const verifyAgent = require("../../middleWare/VerifyAgent");
const propertyAdvertisePatchController = require("../../controllers/PropertyController/propertyAdvertisePatchController");
const advertisePropertyGetController = require("../../controllers/PropertyController/advertisePropertyGetController");
const propertyGetByAgentEmail = require("../../controllers/PropertyController/propertyGetByAgentEmail");
const propertyGetByIdController = require("../../controllers/PropertyController/propertyGetByIdController");
const propertyDeleteByAgentController = require("../../controllers/PropertyController/propertyDeleteByAgentController");
const propertyUpdateByAgentController = require("../../controllers/PropertyController/propertyUpdateByAgentController");
const propertyStatusVerifiedController = require("../../controllers/PropertyController/propertyStatusVerifiedUpdateController");
const propertyRouter = express.Router()

    // properties related api
    // Create a new property
    propertyRouter.post('/properties', propertyPostController);

    // Get verified and filtered properties
    propertyRouter.get('/properties/verified/filtered', propertyVerifiedGetController);

    // Get all properties (admin only)
    propertyRouter.get('/manageProperties', verifyToken,  verifyAdmin, allPropertyGetController);

    // Advertise a property (admin only)
    propertyRouter.patch('/advertiseProperties/:id', verifyToken, verifyAdmin,propertyAdvertisePatchController);

    // Get advertised properties
    propertyRouter.get('/advertiseProperties', advertisePropertyGetController);

    // Get properties by agent (agent only)
    propertyRouter.get('/agentProperties/:email', verifyToken, verifyAgent, propertyGetByAgentEmail);

    // Get a single property by ID
    propertyRouter.get('/singleProperties/:id',propertyGetByIdController );

    // Delete a property (agent only)
    propertyRouter.delete('/properties/:id', verifyToken, verifyAgent, propertyDeleteByAgentController);

    // Update a property (agent only)
    propertyRouter.patch('/properties/:id', verifyToken, verifyAgent, propertyUpdateByAgentController);

    // Update verified status of a property (admin only)
    propertyRouter.patch('/properties/verifiedStatus/:id', verifyToken, verifyAdmin, propertyStatusVerifiedController);


module.exports=propertyRouter;