
const express = require('express');
const router = express.Router();
const { getAudio } = require('../controllers/songs.controller');

router.post('/audio', getAudio);

module.exports = router;
