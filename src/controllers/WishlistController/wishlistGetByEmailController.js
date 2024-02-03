const { wishListCollection } = require("../../DatabaseConfig/connectMongodb");

const wishlistGetByEmailController =  async (req, res) => {
   
        try {
            const email = req.params.wishListerEmail;
            const query = { wishlisterEmail: email };
    
            // Find all wishlist items for the specified wishlister
            const result = await wishListCollection.find(query).toArray();
            res.send(result);
        } catch (error) {
            // Handle errors
            console.error('Error in /allWishlist/:wishListerEmail GET:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    
}

module.exports=wishlistGetByEmailController;