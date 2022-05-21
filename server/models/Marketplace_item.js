const mongoose = require('mongoose');

const Marketplace = new mongoose.Schema({
      _id: {
            type: String,
            required: true
      },
      img: {
            type: String,
            required: true
      },
      name: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      price: {
            type: Number,
            required: true
      },
      maxPerUser: {
            type: Number,
            required: true
      },
      maxHolders: {
            type: Number,
            required: true
      },
      available: {
            type: Number,
            required: true
      },
      date: {
            type: String,
            required: true
      }
})

module.exports = mongoose.model('Marketplace_item', Marketplace);