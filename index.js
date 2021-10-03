// import from pkg
const http = require('http');
const express = require('express');
const path = require('path');

const flash = require('express-flash');
const session = require('express-session');
const hbs = require('hbs'); //viewEngine

// import routes from local directory
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');

// call function express instantiate to var
const app = express();

// use express library
// "./static" is a virtual path prefix
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    cookie: {
      maxAge: 7200 * 1000,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'secretValue',
  })
);

// use flash for sending message
app.use(flash());

// setup flash message
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// set views location to app
app.set('views', path.join(__dirname, 'views'));
// set view engine
app.set('view engine', 'hbs');
// register view partials directory
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// render index page
app.get('/', function (req, res) {
  res.render('index', { title: 'Laragaa | Perlengkapan Olahraga', isLogin: req.session.isLogin, isAdmin: req.session.isAdmin });
});

// app.get('/admin', function (req, res) {
//   res.render('admin/admin', { title: 'Laragaa | Admin', isLogin: true });
// });

// mount routes
app.use('/', adminRoute);
app.use('/', authRoute);
app.use('/', productRoute);
// app.use('/', adminRoute);
// app.use('/', something)

// create server
const server = http.createServer(app);
const port = 7000;
server.listen(port, () => {
  console.log('server running on port: ', port);
});
