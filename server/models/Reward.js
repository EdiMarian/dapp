const mongoose = require('mongoose');

const Reward = new mongoose.Schema({
      address: {
            type: String,
            required: true
      },
      estar: {
            type: Number
      },
      egld: {
            type: Number
      }
})

module.exports = mongoose.model('Reward', Reward);