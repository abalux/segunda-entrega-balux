import { Router, json } from 'express'
import { ProductManagerDB } from '../services/productManagerDB.js'

export const productsRouter = Router()

productsRouter.use(json())

/*productsRouter.get('/products', async (req, res) => {
    try {
        res.json(await ProductManagerDB.findAll())
    } catch (error) {
        res.status(500).json({
        status: 'error',
        message: error.message
        })
    }
}) */

//aca se pone la vista
productsRouter.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const skip = (page - 1) * limit;

        let filter = {};
        if (query) {
        filter = { $or: [{ category: query }, { availability: query }] };
        }

        const totalProducts = await products.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        let sortOptions = {};
        if (sort) {
        sortOptions = { price: sort === 'asc' ? 1 : -1 };
        }

        const products = await products.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .exec();

        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevLink = hasPrevPage ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null;

        res.render('products', {
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page - 1,
            nextPage: page + 1,
            page: page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

productsRouter.get('/products/:id', async (req, res) => {
    try {
        const getProductById = await ProductManagerDB.findById(req.params.id)
        res.json(getProductById)
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        })
    }
})

productsRouter.post('/products', async (req, res) => {
    try {
        const createdProduct = await ProductManagerDB.create(req.body)
        res.status(201).json(createdProduct)
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
})

productsRouter.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await ProductManagerDB.updateById(req.params.id, req.body)
        res.json(updatedProduct)
    } catch (error) {
        if (error.message === 'id not found') {
            res.status(404)
        } else {
        res.status(400)
        }

        res.json({
            status: 'error',
            message: error.message
        })
    }
})

productsRouter.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await ProductManagerDB.deleteById(req.params.id)
        res.json(deletedProduct)
    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: error.message
        })
    }
})