const router = require('express').Router();

// render login page
router.get('/login', function (req, res) {
  res.render('auth/login', { title: 'Laragaa | Login' });
});

// render register page
router.get('/register', function (req, res) {
  res.render('auth/register', { title: 'Laragaa | Register' });
});

module.exports = router;
