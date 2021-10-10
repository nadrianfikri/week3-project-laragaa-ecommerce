const router = require('express').Router();
const dbConnection = require('../connection/db');
const pathFile = 'http://localhost:7000/uploads/';

// render product page
router.get('/product', function (req, res) {
  res.render('product/product', {
    title: 'Laragaa | Product',
    isLogin: req.session.isLogin,
    isAdmin: req.session.isAdmin,
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

      let reverse = results[0].price.toString().split('').reverse().join('');
      let regex = reverse.match(/\d{1,3}/g);
      let newPrice = regex.join('.').split('').reverse().join('');

      const product = {
        ...results[0],
        photo: pathFile + results[0].photo,
      };
      product.displayPrice = newPrice;

      // console.log(product);
      res.render('product/detail', {
        title: 'Laragaa | Product Detail',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        user: req.session.user,
        product,
      });
    });
    conn.release();
  });
});

module.exports = router;
