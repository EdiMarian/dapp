const mongoose = require('mongoose');

const Tournament = new mongoose.Schema({
      _id: {
            type: String,
            required: true
      },
      isActive: {
            type: Boolean,
            required: true
      },
      fee: {
            type: Number,
            required: true
      },
      players: {
            type: Array,
            required: true
      },
      maxPlayers: {
            type: Number,
            required: true
      },
      winners: [],
      lasts: {
            type: Number,
            required: true
      },
      end: {
            type: String,
            required: true
      },
      date: {
            type: String,
            required: true
      }
})

module.exports = mongoose.model('Tournament', Tournament);