const express = require('express');
const router = express.Router();
const eventController = require('../controllers/user/event.controller');

router.get('/action-year', eventController.happenedEventDetail);
router.post('/filterEvents', eventController.filterEvent);
router.post('/filterEventByType', eventController.filterEventByType);
router.get('/:slug', eventController.detailEvent);
router.get('/', eventController.eventPage);

module.exports = router;