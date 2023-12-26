import { dbCarts } from '../models/carts.mongoose.js';
import mongoose from 'mongoose'

export class CartManagerDB {

    async createCart(){
        const newCart = await dbCarts.create({});
        return newCart;
    }

    async getCartById(cartId){
        const cartFound = await dbCarts.findById(cartId).populate('products').lean()
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

    async deleteProductInCart(productId,cartId) {
                try {
                    const cart = await dbCarts.findById(cartId);
                    console.log(cartId)
                    if (cart) {
                        await dbCarts.updateOne(
                            { _id: cartId },
                            { $pull : { 'Products': productId } }
                        );
                        return "product successfully deleted";
                    } else {
                        throw new Error("cart not found");
                    }
                } catch (error) {
                    console.error('Error al eliminar el producto del carrito:', error);
                    throw new Error('Error interno del servidor al eliminar el producto del carrito');
                }
    }
    
    
    
    async deleteAllProductsInCart(cartId){
        const { ObjectId } = mongoose.Types;
        console.log(cartId)
        try {
            const cart = await dbCarts.updateOne({ _id: new ObjectId(cartId) },{ $set: { Products: [] } });
            if (cart.n > 0) {
                return "products successfully deleted";
            } else {
                throw new Error("cart not found");
            }
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
            throw new Error('Error interno del servidor al eliminar todos los productos del carrito');
        }
    }

    async updateProductQuantity(productId, cartId, quantity){

    try {
        const cart = await dbCarts.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        const productIndex = cart.Products.findIndex(product => product._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        cart.Products[productIndex].quantity = quantity;
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    }
}