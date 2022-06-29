const express = require('express');
const router = express.Router();
const passport = require('../config/passport/passport');
const authController = require('../controllers/auth/auth.controller');
 
router.get('/google', passport.scope);
router.get('/google/callback', passport.redirect, authController.redirectURL);


module.exports = router;