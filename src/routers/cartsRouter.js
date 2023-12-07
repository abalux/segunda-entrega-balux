import { Router } from "express";
import { CartManagerDB } from "../services/cartsManager.js";

export const cartsRouter = Router();

cartsRouter.post('/', async (req, res) => {
    const createdCart = await CartManagerDB.createCart();
    if (createdCart){
        res.json({Created: createdCart})
    }else{
        res.json({error: "The cart can't be created"})
    }
})

//aca se pone la vista 
cartsRouter.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params['cid']);
    const cartFound = await CartManagerDB.getCartById(cartId).populate('productos');
    if (cartFound){
        res.render('carts', {cartFound})
    }else{
        res.json({error : "There isn't a cart with that id"})
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) =>{
    const productId = parseInt(req.params['pid']);
    const cartId = parseInt(req.params['cid']);
    const addedProductsInCart = await CartManagerDB.addProductsInCart(productId, cartId);
    if (addedProductsInCart){
        res.json({Cart : addedProductsInCart})
    }else{
        res.json({error: "Products can't be added in that cart"})
    }
})

cartsRouter.delete('/:cid/products/:pid ', async (req,res) => {
    const productId = parseInt(req.params['pid']);
    const cartId = parseInt(req.params['cid']);
    const deletedProductInCart = await CartManagerDB.deleteProductInCart(productId, cartId);
    if (deletedProductInCart){
        res.json({Cart : deletedProductInCart})
    }else{
        res.json({error: "Product can't be deleted in that cart"})    
    }
})

cartsRouter.delete('/:cid ', async (req,res) => {
    const cartId = parseInt(req.params['cid']);
    const deletedProductsInCart = await CartManagerDB.deleteAllProductsInCart(cartId);
    if (deletedProductsInCart){
        res.json({Cart : deletedProductsInCart})
    }else{
        res.json({error: "Products can't be deleted in that cart"})
    }
})

cartsRouter.put('/:cid/products/:pid ', async (req,res) => {
    const productId = parseInt(req.params['pid']);
    const cartId = parseInt(req.params['cid']);
    const updatedProductQuantity = await CartManagerDB.updateProductQuantity(productId, cartId, newQuantity);
    if (updatedProductQuantity){
        res.json({Cart: updatedProductQuantity})
    }else{ 
        res.json({error: "quantity can't be updated"})
    }
})