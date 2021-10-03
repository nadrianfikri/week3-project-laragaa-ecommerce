const router = require('express').Router();

// render admin dashboard page
router.get('/admin', function (req, res) {
  res.render('admin/admin', { title: 'Laragaa | Admin', isLogin: true });
});

// render manage order page
router.get('/admin/manageorder', function (req, res) {
  res.render('admin/manageorder', { title: 'Laragaa | Daftar Pesanan', isLogin: true });
});
module.exports = router;
