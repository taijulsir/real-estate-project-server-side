const { ObjectId } = require("mongodb");
const { wishListCollection } = require("../../DatabaseConfig/connectMongodb");

const wishlistGetByIdController = async (req, res) => {
  
        try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
    
            // Find the wishlist item by ID
            const wishlistItem = await wishListCollection.findOne(query);
    
            // Extract and format price range
            const priceRange = wishlistItem.priceRange;
            const [minPrice, maxPrice] = priceRange.split('-').map(price => parseFloat(price.replace(/,/g, '')));
    
            const result = {
                ...wishlistItem,
                priceRange: [minPrice, maxPrice],
            };
    
            res.send(result);
        } catch (error) {
            // Handle errors
            console.error('Error in /wishlist/:id GET:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    
}

module.exports=wishlistGetByIdController;