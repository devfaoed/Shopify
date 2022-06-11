import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    file: String,
    name: String,
    price: String,
    category: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model("Product", productSchema);

export default Product;

