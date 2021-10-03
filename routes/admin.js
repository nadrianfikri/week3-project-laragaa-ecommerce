const router = require('express').Router();

// render admin page
router.get('/admin', function (req, res) {
  res.render('admin/admin', { title: 'Laragaa | Admin', isLogin: true });
});

module.exports = router;
