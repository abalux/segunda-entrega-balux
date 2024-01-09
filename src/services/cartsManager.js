import { dbCarts } from '../models/carts.mongoose.js';
import mongoose from 'mongoose'

export class CartManagerDB {

    async createCart(){
        const newCart = await dbCarts.create({ _id: new mongoose.Types.ObjectId() });
        return newCart;
    }

    async getCartById(cartId){
        const cartsId = new mongoose.Types.ObjectId(cartId);
        const cartFound = await dbCarts.findById(cartsId).populate(({
            path: 'Products.product',
            model: 'products'
        })).lean();
        console.log('Cart after Population:', cartFound);
        if (!cartFound) {
            throw new Error('id not found')
        }
        return cartFound
    }
    
    //se tiene que usar el nuevo _id del producto en el carrito
    async deleteProductInCart(productId, cartId) {
        try {
            const cartsId = new mongoose.Types.ObjectId(cartId);

            const updatedCart = await dbCarts.findByIdAndUpdate(
                cartsId,
                { $pull: { Products: { _id: productId } } },
                { new: true }
            );
    
            if (!updatedCart) {
                throw new Error("No se pudo encontrar el carrito con ese ID");
            }
    
            const deletedProduct = updatedCart.Products.find(product => product._id.toString() === productId);
            const deletedQuantity = deletedProduct ? deletedProduct.quantity : 0;
    
            return {
                message: "Producto eliminado exitosamente",
                deletedQuantity: deletedQuantity
            };
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Error interno del servidor al eliminar el producto del carrito');
        }
    }
    
    async deleteAllProductsInCart(cartId) {
        const { ObjectId } = mongoose.Types;
        console.log('Deleting products from cart with ID:', cartId);
    
        try {
            const cart = await dbCarts.findById(cartId);
    
            if (!cart) {
                return "Cart not found";
            }
    
            const result = await dbCarts.updateOne(
                { _id: new ObjectId(cartId) },
                { $set: { Products: [] } }
            );
    
            console.log('Update result:', result);
    
            if (result && result.result && result.result.n > 0) {
                return "Products successfully deleted";
            } else {
                return "No products to delete in the cart";
            }
        } catch (error) {
            console.error('Error deleting products from cart:', error);
            throw new Error('Internal server error while deleting products from cart');
        }
    }
}
