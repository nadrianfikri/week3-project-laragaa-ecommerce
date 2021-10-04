// import from pkg
const http = require('http');
const express = require('express');
const path = require('path');

const session = require('express-session');
const flash = require('express-flash');
const hbs = require('hbs'); //viewEngine
const dbConnection = require('./connection/db');

// import routes from local directory
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');

// call function express instantiate to var
const app = express();

// use express library
// "./static" is a virtual path prefix
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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

// app.get('/', function (req, res) {});

// render index page
app.get('/', function (req, res) {
  const query =
    'SELECT tb_products.*, tb_categories.name AS categoryName, tb_brands.name AS brandName FROM tb_products JOIN tb_categories ON tb_categories.id = tb_products.categories_id JOIN tb_brands ON tb_brands.id = tb_products.brands_id ORDER BY tb_products.id DESC';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let products = [];

      for (let result of results) {
        products.push({
          ...result,
          photo: 'http://localhost:7000/uploads/' + result.photo,
        });
      }

      res.render('index', {
        title: 'Laragaa | Perlengkapan Olahraga',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        products,
      });
    });
    conn.release();
  });
});

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
