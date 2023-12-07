import { Schema, model } from 'mongoose'
import mongoose from 'mongoose'

const cartSchema = new Schema({
    _id: { type: String, required: true },
    Products : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products' 
        }
    ]
})

export const dbCarts = model('carts', cartSchema)