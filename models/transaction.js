
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Transaction = new Schema({
  email: String,
  amount: Number,
  status: String,
  
  created_at: {type: Date, default: new Date()},
});



module.exports = mongoose.model('Transaction', Transaction)
