import { Schema, model } from 'mongoose'
import mongoose from 'mongoose'

const cartSchema = new Schema({
    _id: {  type: mongoose.Schema.Types.ObjectId  /*, default: new mongoose.Types.ObjectId , required: true*/},
    Products : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products' 
        }
    ]
})

export const dbCarts = model('carts', cartSchema) 