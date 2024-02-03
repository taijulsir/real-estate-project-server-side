const express = require ("express");
const reviewPostController = require("../../controllers/ReviewController/reviewPostController");
const verifyToken = require("../../middleWare/VerifyToken");
const verifyAdmin = require("../../middleWare/VerifyAdmin");
const allReviewGetController = require("../../controllers/ReviewController/allReviewGetController");
const reviewGetByUserEmailController = require("../../controllers/ReviewController/reviewGetByUserEmailController");
const singleReviewsGetByIdController = require("../../controllers/ReviewController/singleReviewsGetByIdController");
const reveiwGetByPropertyTitleController = require("../../controllers/ReviewController/reviewGetByPropertyTitleController");
const reviewDeleteController = require("../../controllers/ReviewController/reviewDeleteController");
const reviewRouter = express.Router()

    // review related api
    // API to add a new review
   reviewRouter.post('/reviews', reviewPostController);

    // API to manage reviews (accessible only to admin after token verification)
   reviewRouter.get('/manageReviews', verifyToken, verifyAdmin, allReviewGetController);

    // API to get all reviews
   reviewRouter.get('/allReviews', allReviewGetController);

    // API to get reviews by user email
   reviewRouter.get('/userMyReviews/:email', reviewGetByUserEmailController);

    // API to get reviews by property ID
   reviewRouter.get('/singleReviews/:id',singleReviewsGetByIdController);

    // API to get reviews by property title
   reviewRouter.get('/reviews/:propertyTitle', reveiwGetByPropertyTitleController);

    // API to delete a review by ID
   reviewRouter.delete('/reviews/:id', reviewDeleteController);


module.exports = reviewRouter;