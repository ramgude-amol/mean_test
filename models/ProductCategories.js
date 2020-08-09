const mongoose = require('mongoose');

const productCategoriesSchema = new mongoose.Schema({
   /* 'id':{
        type:Number,
        required:true
    },*/
    'category_id':{
        type:Number,
        required: false
    },
    'product_id':{
        type:Number,
        required:false
    },
    'createdAt':{
        type:Date,
        default: new Date()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("product_category_mappings",productCategoriesSchema);