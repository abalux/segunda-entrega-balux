import { dbCarts } from "../models/carts.mongoose.js";
import { randomUUID } from 'crypto'

export class CartManagerDB {
    async createCart(){
        const cartId = randomUUID();
        const cart = await dbCarts.create({ _id: cartId });
        return cart.toObject();
    }

    async getCartById(cartId){
        const cartFound = await dbProducts.findById(cartId).lean()
        if (!cartFound) {
            throw new Error('id not found')
        }
        return cartFound
    }

    async addProductsInCart(productId, cartId, quantity = 1) {
        try {
            const cart = await dbCarts.findById(cartId);
            if (cart) {
                const existingProductIndex = cart.Products.indexOf(productId);
                if (existingProductIndex !== -1) {
                    await dbCarts.updateOne(
                        { _id: cartId, 'Products': productId },
                        { $inc: { 'Products.$': quantity } }
                    );
                } else {
                    await dbCarts.updateOne(
                        { _id: cartId },
                        { $push: { 'Products': productId } }
                    );
                }
            const updatedCart = await dbCarts.findById(cartId);
            return updatedCart;
            } else {
            throw new Error("No existe un carrito con ese ID");
            }
        } catch (error) {
            console.error('Error al agregar productos al carrito:', error);
            throw new Error('Error interno del servidor al agregar productos al carrito');
        }
    }

    async deleteProductInCart(productId, cartId){
        try{
            const cart = await dbCarts.findByIdAndUpdate( cartId, { $pull: { 'Products': { product: productId } } }, { new: true })
            if (cart) {
                return cart
            }else{
                throw new Error("cart not found")
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Error interno del servidor al eliminar el producto del carrito');
        }
    }

    async deleteAllProductsInCart(cartId){
        try {
            const cart = await dbCarts.updateOne({ _id: cartId },{ $set: { Products: [] } });
            if (cart.nModified > 0) {
                return "products successfully deleted";
            } else {
                throw new Error("cart not found");
            }
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
            throw new Error('Error interno del servidor al eliminar todos los productos del carrito');
        }
    }

    async updateProductQuantity(productId, cartId, newQuantity){
        try {
            const cart = await dbCarts.updateOne({ _id: cartId, 'Products.product': productId },{ $set: { 'Products.$.quantity': newQuantity } });
            if (cart.nModified > 0) {
                return "product quantity successfully updated";
            } else {
                throw new Error("cart not found or product not in cart");
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            throw new Error('Error interno del servidor al actualizar la cantidad del producto en el carrito');
        }
    }
//acordate que tenes que fijarte lo dep products y lo de id etc etc sino no te lo va a tomar
   
}