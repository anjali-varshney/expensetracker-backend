const mongoose = require('mongoose');
const {Schema} = mongoose;

const ExpensesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name:{
        type: String,
        required: true
    },
    amount:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    category:{
        type: String,
        default: 'Personal'
    },
    mode:{
        type: String,
        required: true,
        default: 'UPI'
    }    
})

module.exports = mongoose.model('expense',ExpensesSchema);