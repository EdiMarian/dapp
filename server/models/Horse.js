const mongoose = require('mongoose');

const Horse = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      fileUri: {
            type: String,
            required: true
      },
      horseName: {
            type: String,
            required: true
      },
      rarity: {
            type: String,
            required: true
      },
      speed: {
            type: Number,
            required: true
      },
      endurance: {
            type: Number,
            required: true
      },
      agility: {
            type: Number,
            required: true
      },
      luck: {
            type: Number,
            required: true
      },
      spot: {
            type: String,
            required: true
      },
      inRace: {
            type: Boolean,
            required: true
      },
      race: {
            type: String,
            required: true
      },
      stamina: {
            type: Number,
            required: true
      }
})

module.exports = mongoose.model('Horses', Horse);