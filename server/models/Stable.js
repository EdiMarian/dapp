const mongoose = require('mongoose');

const Stable = new mongoose.Schema({
      address: {
            type: String,
            required: true
      },
      level: {
            type: Number,
            required: true
      },
      history: [],
      date: {
            type: String,
      }
})

module.exports = mongoose.model('Stable', Stable);