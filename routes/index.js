const express = require('express');
const router = express.Router();

router.use('/alert', require('./alert/index'));

module.exports = router;