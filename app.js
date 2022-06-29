const express = require('express')
const path = require('path');
const session    = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const passport = require('passport');
const exp_hbs = require('express-handlebars')
require('dotenv').config()


const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla' 
}));
app.use(passport.initialize());
app.use(passport.session());
//For Handlebars
app.set('views', path.join(__dirname,'src/views'))
app.engine('.hbs', exp_hbs.engine({ extname: '.hbs', defaultLayout: "main"}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname,'src/public')))
app.use('/js', express.static(__dirname + 'src/public/js'));
app.use(cookieParser());


var authRoute = require('./src/routes/index.route');
authRoute(app);

var models = require("./src/models");
models.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine')

}).catch(function(err) {

  console.log(err, "Something went wrong with the Database Update!")

});

const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})