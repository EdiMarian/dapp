const mongoose = require('mongoose');

const User = new mongoose.Schema({
      address: {
            type: String,
            required: true
      },
      username: {
            type: String,
            required: true,
            unique: true
      },
      admin: {
            type: Boolean,
            default: false
      },
      inventory: {
            type: Array,
            default: []
      }
})

module.exports = mongoose.model('User', User);