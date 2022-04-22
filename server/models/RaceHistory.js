const mongoose = require('mongoose');

const RaceHistory = new mongoose.Schema({
      _id: {
            type: String,
            required: true
      },
      raceId: {
            type: String,
            required: true
      },
      bonus: {
            type: String,
            required: true
      },
      winners: [],
      player: [],
      date: {
            type: String,
            required: true
      }
})

module.exports = mongoose.model('RaceHistory', RaceHistory);