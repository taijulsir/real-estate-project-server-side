const { wishListCollection } = require("../../DatabaseConfig/connectMongodb");

const wishlistPostController = () => {
    async (req, res) => {
        try {
            const wishlist = req.body;
    
            // Check if the wishlist item already exists
            const isExisting = await wishListCollection.findOne({
                wishlistId: wishlist.wishlistId,
                wishlisterEmail: wishlist.wishlisterEmail
            });
    
            if (isExisting) {
                // Wishlist item already exists, send a message
                return res.send({ message: 'Already added this property', insertedId: null });
            }
    
            // Insert the new wishlist item
            const result = await wishListCollection.insertOne(wishlist);
            res.send(result);
        } catch (error) {
            // Handle errors
            console.error('Error in /wishlist POST:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

module.exports=wishlistPostController;