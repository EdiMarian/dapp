const mongoose = require('mongoose');

const Winner = new mongoose.Schema({
      trackId: {
            type: String,
            required: true
      },
      score: {
            type: Number,
            required: true
      },
      bonus: {
            type: String,
            required: true
      },
      address: {
            type: String,
            required: true
      },
      horse: {
            type: String,
            required: true
      },
      date: {
            type: Date,
            default: Date.now
      }
})

module.exports = mongoose.model('Winners', Winner);