import express from 'express'
import mongoose from 'mongoose'
import { __filename, __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { MONGODB_CNX_STR, PORT } from './config.js'
import { productsRouter } from './routers/productsRouter.js'
import { cartsRouter } from './routers/cartsRouter.js'

await mongoose.connect(MONGODB_CNX_STR)
console.log(`base de datos conectada a ${MONGODB_CNX_STR}`)

const app = express()

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(PORT, () => {
    console.log(`servidor http escuchando en puerto ${PORT}`)
})

app.use('/', productsRouter)
app.use('/carts', cartsRouter)