const router = require('express').Router();
const dbConnection = require('../connection/db');

// render product page
router.get('/product', function (req, res) {
  res.render('product/product', {
    title: 'Laragaa | Product',
    isLogin: req.session.isLogin,
    isAdmin: req.session.isAdmin,
    product,
  });
});

// render detail product
router.get('/product/:id', function (req, res) {
  const { id } = req.params;

  const query = 'SELECT * FROM tb_products WHERE id = ?';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) throw err;

      const product = results[0];

      res.render('product/detail', {
        title: 'Laragaa | Product Detail',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        product,
      });
    });
    conn.release();
  });
});

// if (req.session.isLogin) {
//   if (req.session.isLogin == products) {
//   }
// }
module.exports = router;
