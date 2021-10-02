// import from pkg
const http = require('http');
const express = require('express');
const path = require('path');

const hbs = require('hbs'); //viewEngine

// import routes from local directory
const authRoute = require('./routes/auth');

// call function express instantiate to var
const app = express();

// use express library
// "./static" is a virtual path prefix
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// set views location to app
app.set('views', path.join(__dirname, 'views'));
// set view engine
app.set('view engine', 'hbs');
// register view partials directory
hbs.registerPartials(path.join(__dirname, 'views/partials'));

let isLogin = true;
let isAdmin = true;
// render index page
app.get('/', function (req, res) {
  res.render('index', { title: 'Laragaa | Perlengkapan Olahraga', isLogin, isAdmin });
});

// mount routes
app.use('/', authRoute);
// app.use('/', something);

// create server
const server = http.createServer(app);
const port = 7000;
server.listen(port, () => {
  console.log('server running on port: ', port);
});
