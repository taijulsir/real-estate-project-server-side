const express = require("express");
const wishlistPostController = require("../../controllers/WishlistController/wishlistPostController");
const wishlistGetByIdController = require("../../controllers/WishlistController/wishlistGetByIdController");
const wishlistGetByEmailController = require("../../controllers/WishlistController/wishlistGetByEmailController");
const wishlistDeleteController = require("../../controllers/WishlistController/wishlistDeleteController");
const wishlistRouter = express.Router()
// wishlist related api

// Create or update a wishlist item
wishlistRouter.post('/wishlist', wishlistPostController);

// Get a specific wishlist item by ID
wishlistRouter.get('/wishlist/:id', wishlistGetByIdController);

// Get all wishlist items for a specific wishlister
wishlistRouter.get('/allWishlist/:wishListerEmail', wishlistGetByEmailController );

// Delete a wishlist item by ID
wishlistRouter.delete('/wishlist/:id', wishlistDeleteController);


module.exports=wishlistRouter;