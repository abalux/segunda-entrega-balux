import { Schema, model } from 'mongoose'


const productSchema = new Schema({
    _id: { type: String, required: true },
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Price: { type: Number, required: true },
    Stock: { type: Number, required: true },
}, {
    strict: 'throw',
    versionKey: false,
    statics: {},
    methods: {}
})

export const dbProducts = model('products', productSchema)