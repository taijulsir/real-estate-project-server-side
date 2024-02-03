const express = require("express");
const userPostJwtControllers = require("../../controllers/UserController/userPostJwtController");
const userPostController = require("../../controllers/UserController/userPostController");
const verifyToken = require("../../middleWare/VerifyToken");
const verifyAdmin = require("../../middleWare/VerifyAdmin");
const userRoleCheckController = require("../../controllers/UserController/userRoleCheckController");
const userGetController = require("../../controllers/UserController/userGetController");
const userDeleteController = require("../../controllers/UserController/userDeleteController");
const userRoleUpdatePatchController = require("../../controllers/UserController/userRoleUpdatePatchController");
const userFraudAgentPatchController = require("../../controllers/UserController/userFraudAgentPatchController");

const userRouter = express.Router()


    // JWT related API
   userRouter.post('/jwt', userPostJwtControllers);

    // User related API - Create user
   userRouter.post('/users', userPostController);

    // Check admin or agent
   userRouter.get('/users/checkRole/:email', verifyToken, userRoleCheckController );

    // User related API - Get all users
   userRouter.get('/users', verifyToken, verifyAdmin, userGetController);

    // User related API - Delete user
   userRouter.delete('/users/:id', verifyToken, verifyAdmin, userDeleteController);

    // Update user role
   userRouter.patch('/users/admin/:id', verifyToken, verifyAdmin, userRoleUpdatePatchController);

    // Handle fraud agent
   userRouter.patch('/users/fraud/:id', verifyToken, verifyAdmin, userFraudAgentPatchController);

module.exports = userRouter;