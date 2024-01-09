import { Router, json } from "express";
import { CartManagerDB } from "../services/cartsManager.js";
import { dbCarts } from "../models/carts.mongoose.js";

export const cartsRouter = Router();
const cartManager = new CartManagerDB();
cartsRouter.use(json())

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
    const cartId = req.params.cid
    const cartFound = await cartManager.getCartById(cartId);
    console.log('Cart with Products:', cartFound);
    if (cartFound){
        res.render('carts', {cartFound})
    }else{
        res.json({error : "There isn't a cart with that id"})
    }
})

cartsRouter.post('/:cid/products/:pid', async (req, res) =>{

    const addProduct = await dbCarts.findByIdAndUpdate(
        req.params.cid,
        { $push: { Products: { product: req.params.pid, quantity: 1 } } },
        { new: true }
    ).lean()
    res.status(201).json({ message: 'Producto Agregado', info: addProduct })  
})



cartsRouter.delete('/:cid/products/:pid', async (req,res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    console.log(cartId)
    const deletedProductInCart = await cartManager.deleteProductInCart(productId,cartId);
    if (deletedProductInCart){
        res.json({Cart : deletedProductInCart})
    }else{
        res.json({error: "Product can't be deleted in that cart"})    
    }
})

cartsRouter.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    console.log(cartId);

    try {
        const deletedProductsInCart = await cartManager.deleteAllProductsInCart(cartId);

        if (deletedProductsInCart.includes('successfully')) {
            res.json({ message: deletedProductsInCart });
        } else {
            res.status(404).json({ error: deletedProductsInCart });
        }
    } catch (error) {
        console.error('Error al eliminar productos del carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req,res) => {
    const { quantity } = req.body;
    const producto = await dbCarts.findByIdAndUpdate(
        req.params.cid,
        { $set: { "Products.$[product].quantity": quantity }},
        { arrayFilters: [{ "product._id": req.params.pid }]},
        { new: true }
    )
    res.status(201).json({ message: 'Producto Actualizado', info: producto})
})
