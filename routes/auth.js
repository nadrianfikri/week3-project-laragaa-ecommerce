const router = require('express').Router();
const dbConnection = require('../connection/db');
const bycrypt = require('bcrypt');

// render login page
router.get('/login', function (req, res) {
  res.render('auth/login', {
    title: 'Laragaa | Login',
    isLogin: req.session.isLogin,
    isAdmin: req.session.isAdmin,
  });
});

// handle login
router.post('/login', function (req, res) {
  const { email, password } = req.body;
  const query = 'SELECT * FROM tb_users WHERE email = ?';

  //
  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [email], (err, results) => {
      if (err) throw err;

      // compare password db and user

      const isMatch = bycrypt.compareSync(password, results[0].password);

      if (!isMatch) {
        req.session.message = {
          type: 'danger',
          message: 'email or password is incorrect',
        };
        return res.redirect('/login');
      } else {
        req.session.message = {
          type: 'success',
          message: 'login successfull',
        };

        let isAdmin = false;
        if (results[0].status === 1) {
          isAdmin = true;
        }

        req.session.isLogin = true;
        req.session.isAdmin = isAdmin;
        req.session.user = {
          id: results[0].id,
          email: results[0].email,
          name: results[0].name,
          address: results[0].address,
        };

        return res.redirect('/');
      }
    });

    conn.release();
  });
});

// handle logout
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

// render register page
router.get('/register', function (req, res) {
  res.render('auth/register', {
    title: 'Laragaa | Register',
    isLogin: req.session.isLogin,
    isAdmin: req.session.isAdmin,
  });
});

// handle register from user
router.post('/register', function (req, res) {
  const { email, name, password, address } = req.body;
  const status = 0; //not admin

  // execute query
  const query = 'INSERT INTO tb_users(name, email, password, address, status) VALUES (?,?,?,?,?)';

  // hashing password
  const hashedPassword = bycrypt.hashSync(password, 10);

  dbConnection.getConnection((err, conn) => {
    conn.query(query, [name, email, hashedPassword, address, status], (err, results) => {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'register successfull',
      };
      res.redirect('/register');
    });

    conn.release();
  });
});

module.exports = router;
