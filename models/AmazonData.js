const mongoose = require('mongoose')

const DataSchema = new mongoose.Schema(
    {
        name:{
            type:String
        },
        price:{
            type:String
        },
        rating:{
            type:String
        },
        srcs:{
            type:String
        },
        offers:{
            type:String
        }
    }
);

module.exports = mongoose.model("amzn",DataSchema,'amznProducts')