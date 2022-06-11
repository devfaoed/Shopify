import express  from "express";
const app = express();

import bodyParser from "body-parser";
import mongoose from "mongoose";
import alert from "alert";
import multer from "multer";

const port = process.env.PORT || 4040;

// function to use multer to save file into diskstorage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
}) 

const uploadStorage = multer({storage:storage})

//importing database from model
import Product from "./model/product.js";


//oofline connection
//  mongoose.connect("mongodb://localhost/shopify", {useNewUrlParser: true, useUnifiedTopology: true});


//online connection
const url = "mongodb+srv://adedokun:adedokun@cluster0.inbfm.mongodb.net/edulogy?retryWrites=true&w=majority";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.set("view engine", "ejs");


// route to redirect to index
app.get("/", (req, res) => {
    res.redirect("/index");
})

// index route
app.get("/index", (req, res) => {
    Product.find({}, (err, products) => {
        if(err){
            console.log(err)
        }
        else{
            res.render("index", {products: products})
        }
    }).sort({"date" : -1})
   
})

//route to products form
app.get("/upload", (req, res) => {
    res.render("upload");
})

// route to upload products into the database
app.post("/upload",  uploadStorage.single("file"), (req, res) => {
    const Data = {
        file: req.file.filename,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description
    }
    
    Product.create(Data, (err, upload) => {
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/index")
            console.log("Product uploaded successfully");
        }
    })
   
})

app.get("/:id", (req, res) => {
    Product.findById(req.params.id, (err, details) => {
        if(err){
            console.log(err)
        }
        else{
            res.render("deatils", {details:details})
        }
    })
})

// port to access interface & client on the browser
app.listen(port, () =>{
    console.log("Listening on port " + port + ", Happy coding!!!")
})