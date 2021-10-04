const router = require('express').Router();

// render admin dashboard page
router.get('/admin', function (req, res) {
  res.render('admin/admin', { title: 'Laragaa | Admin', isLogin: true });
});

// render manage order page
router.get('/admin/manageorder', function (req, res) {
  res.render('admin/manageorder', { title: 'Laragaa | Admin Daftar Pesanan', isLogin: true });
});

// render category page
router.get('/admin/category', function (req, res) {
  res.render('admin/category', { title: 'Laragaa | Admin Kategori', isLogin: true });
});

// render admin product page
router.get('/admin/product', function (req, res) {
  res.render('admin/product', { title: 'Laragaa | Admin Produk', isLogin: true });
});

// render payment page
router.get('/admin/payment', function (req, res) {
  res.render('admin/payment', { title: 'Laragaa | Admin Pembayaran', isLogin: true });
});

// render customer page
router.get('/admin/customer', function (req, res) {
  res.render('admin/customer', { title: 'Laragaa | Admin Pelanggan', isLogin: true });
});

module.exports = router;
