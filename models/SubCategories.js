const mongoose = require('mongoose');

const subCategoriesSchema = new mongoose.Schema({
   /* 'id':{
        type:Number,
        required:true
    },*/
    'category_id':{
        type:Number,
        required: false
    },
    'parent_category_id':{
        type:Number,
        required:false
    },
    'createdAt':{
        type:Date,
        default: new Date()
    }
});

module.exports = mongoose.model("sub_categories",subCategoriesSchema);