const mongoose = require('mongoose');

const Race = new mongoose.Schema({
      _id: {
            type: String,
            required: true
      },
      id: {
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
      player: [
            {
                  address: {
                        type: String,
                        required: true
                  },
                  horse: {
                        type: String,
                        required: true
                  },
                  horseUrl: {
                        type: String,
                        required: true
                  },
                  feePaid: {
                        type: Boolean,
                        default: false
                  },
                  date: {
                        type: String,
                        required: true
                  },
                  _id: {
                        type: String,
                        required: false
                  }
            }
      ],
      date: {
            type: String,
            required: true
      }
})

module.exports = mongoose.model('Race', Race);