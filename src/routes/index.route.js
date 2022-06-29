const event = require('./event');
const admin = require('./admin');
const home = require('./home');
const auth = require('./auth');

module.exports = function(app) {
    app.use('/events', event);
    app.use('/admin', admin);
    app.use('/auth', auth);
    app.use('/', home);
}
