const { ObjectId } = require("mongodb");
const { wishListCollection } = require("../../DatabaseConfig/connectMongodb");

const wishlistDeleteController =  async (req, res) => {
  
        try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
    
            // Delete the wishlist item by ID
            const result = await wishListCollection.deleteOne(query);
            res.send(result);
        } catch (error) {
            // Handle errors
            console.error('Error in /wishlist/:id DELETE:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    
}

module.exports=wishlistDeleteController;