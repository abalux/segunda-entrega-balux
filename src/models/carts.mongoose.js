import { Schema, model } from 'mongoose'
import mongoose from 'mongoose'

const cartSchema = new Schema({
    _id: {  type: mongoose.Schema.Types.ObjectId},
    Products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: { type: Number, default: 0 }
    }]

})

export const dbCarts = model('carts', cartSchema) 