const mongoose = require('mongoose');

const Race = new mongoose.Schema({
      address: {
            type: String,
            required: true
      },
      horse: {
            type: String,
            required: true
      },
      track: {
            name: {
                  type: String,
                  required: true
            },
            class: {
                  type: String,
                  required: true
            }
      },
      fee: {
            paid: {
                  type: Boolean,
                  required: true
            },
            pwith: {
                  type: String,
                  required: true
            }
      },
      status: {
            type: String,
            default: 'Waiting'
      },
      date: {
            type: Date,
            default: Date.now
      }
})

module.exports = mongoose.model('Races', Race);