const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    'id': {
        type : Number,
        required: true
    },
    'category_title': {
        type: String,
       required: true,
    },
    'categ_desc':{
        type : String,
        required: true
    },
    'createdAt':{
        type:Date,
        default: new Date()

    }
}, {
    versionKey: false
});


module.exports = mongoose.model('categories', categorySchema );