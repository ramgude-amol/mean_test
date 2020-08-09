const mongoose = require('mongoose');

const countersSchema = new mongoose.Schema({

    '_id':{
        type:String,
        required: true
    },
    'sequence_value':{
        type: Number,
      //  required:true
    }
} ,{
    versionKey: false
});

module.exports = mongoose.model("counters",countersSchema);