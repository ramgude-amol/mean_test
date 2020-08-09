const mongoose = require('mongoose');
const counters = require("./Counters");
const productsSchema = new mongoose.Schema({
    'id':{
        type:Number,
        required:true,
    },
    'product_title':{
        type: String,
       required:true
    },
    'prod_desc':{
        type:String,
        required:false
    },
    'price':{
        type:Number,
        required:true
    },
    'createdAt':{
        type:Date,
        default: new Date()

    }
} ,{
    versionKey: false
});


module.exports = mongoose.model("Products",productsSchema);