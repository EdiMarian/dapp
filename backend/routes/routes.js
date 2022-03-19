const express = require('express');
const router = express.Router();
const RaceHistorySchema = require('../models/RaceHistory');
const RaceSchema = require('../models/Race');

router.post('/history', (req, res) => {
      const RaceHistory = new RaceHistorySchema({
            address: req.body.address,
            horse: req.body.horse,
            track: req.body.track,
            fee: req.body.fee,
            status: req.body.status
      })
      RaceHistory.save()
      .then(data => res.json(data))
      .catch(err => res.json(err));
});

router.post('/enter', (req, res) => {
      const Race = new RaceSchema({
            address: req.body.address,
            horse: req.body.horse,
            track: req.body.track,
            fee: req.body.fee,
            status: req.body.status
      })
      Race.save()
      .then(data => res.json(data))
      .catch(err => res.json(err));
})

router.get('/track/1', (req, res) => {
      RaceSchema.find({"track.name": "1"}).then(data => res.json(data)).catch(err => res.json(err));
});
router.get('/track/2', (req, res) => {
      RaceSchema.find({"track.name": "2"}).then(data => res.json(data)).catch(err => res.json(err));
});
router.get('/track/3', (req, res) => {
      RaceSchema.find({"track.name": "3"}).then(data => res.json(data)).catch(err => res.json(err));
});
router.get('/track/4', (req, res) => {
      RaceSchema.find({"track.name": "4"}).then(data => res.json(data)).catch(err => res.json(err));
});
router.get('/track/5', (req, res) => {
      RaceSchema.find({"track.name": "5"}).then(data => res.json(data)).catch(err => res.json(err));
});

module.exports = router;