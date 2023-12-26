import { Router } from "express";
import { CartManagerDB } from "../services/cartsManager.js";

export const cartsRouter = Router();
const cartManager = new CartManagerDB();

cartsRouter.post('/', async (req, res) => {
    const createdCart = await cartManager.createCart()
    if (createdCart){
        res.json({Created: createdCart})
    }else{
        res.json({error: "The cart can't be created"})
    }
})

//aca se pone la vista 
cartsRouter.get('/:cid', async (req, res) => {
    const cartId = req.params['cid'] /*le acabas de sacar el parseInt*/
    const cartFound = await cartManager.getCartById(cartId)/*.populate('productos')*/;
    if (cartFound){
        res.render('carts', {cartFound})
    }else{
        res.json({error : "There isn't a cart with that id"})
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) =>{
    const productId = req.params['pid'];
    const cartId = req.params['cid'];
    const addedProductsInCart = await cartManager.addProductsInCart(productId, cartId);
    if (addedProductsInCart){
        res.json({Cart : addedProductsInCart})
    }else{
        res.json({error: "Products can't be added in that cart"})
    }
})

cartsRouter.delete('/:cid/products/:pid ', async (req,res) => {
    const productId = req.params['pid'];
    const cartId = req.params['cid'];
    console.log(cartId)
    const deletedProductInCart = await cartManager.deleteProductInCart(productId, cartId);
    if (deletedProductInCart){
        res.json({Cart : deletedProductInCart})
    }else{
        res.json({error: "Product can't be deleted in that cart"})    
    }
})

cartsRouter.delete('/:cid', async (req,res) => {
    const cartId = req.params['cid'];
    console.log(cartId)
    const deletedProductsInCart = await cartManager.deleteAllProductsInCart(cartId);
    if (deletedProductsInCart){
        res.json({Cart : deletedProductsInCart})
    }else{
        res.json({error: "Products can't be deleted in that cart"})
    }
})

cartsRouter.put('/:cid/products/:pid ', async (req,res) => {
    const productId = req.params['pid'];
    const cartId = req.params['cid'];
    const { quantity } = req.body;
    const updatedProductQuantity = await cartManager.updateProductQuantity(productId, cartId, quantity);
    if (updatedProductQuantity){
        res.json({Cart: updatedProductQuantity})
    }else{ 
        res.json({error: "quantity can't be updated"})
    }
})