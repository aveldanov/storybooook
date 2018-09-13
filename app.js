const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//Load Models
require('./models/User');
require('./models/Story');


//Passport config
require('./config/passport')(passport);


//Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
//Load keys
const keys = require('./config/keys');
//NEW
const users = require('./routes/users');


//Handlebars Helper

const {
  truncate, stripTags, formatDate, select, editIcon
} = require('./helpers/hbs');





//Map global promise  - to get rid of warning
//mongoose.Promise = global.Promise;


//Mongoose connect

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('mongoDB connected...')
  })
  .catch((err) => {
    console.log(err)
  });

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method Override Middleware

app.use(methodOverride('_method'));

//Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate:truncate,
    stripTags:stripTags,
    formatDate:formatDate,
    select:select,
    editIcon:editIcon
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//Cookie parser and express-session middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

//Passport middleware and needs express-sesson and cookie-parser
app.use(passport.initialize());
app.use(passport.session());


// Set global VARs
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});



//Set static folder 
app.use(express.static(path.join(__dirname, 'public')));


//Use Routes(load router module in the app)
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);
app.use('/users',users);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server! started on port ${port}`);
});