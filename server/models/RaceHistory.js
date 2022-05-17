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
      entryFee: {
            type: Number,
            required: true
      },
      with: {
            type: String,
            required: true
      },
      winners: [],
      player: [],
      startDate: {
            type: String,
            required: true
      },
      endDate: {
            type: String,
            required: true
      },
      month: {
            type: Number,
            required: true
      }
})

module.exports = mongoose.model('RaceHistory', RaceHistory);