const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
    unique: true
  },
  email:{
    type: String,
    require: true,
    minlength: 10,
    unique: true
  },
  password:{
    type: String,
    required: true,
    minlength: 8,
  },
  admin:{
    type: Boolean,
    default: false
  }
}, {collection: 'users'})

module.exports = mongoose.model('User', userSchema)