const router = require('express').Router();
const dbConnection = require('../connection/db');
// const uploadFile = require('../middlewares/uploadFile');

// render cart
router.get('/cart', function (req, res) {
  if (!req.session.isLogin) {
    req.session.message = {
      type: 'danger',
      message: 'you must be login',
    };

    return res.redirect('/login');
  }
  const query = 'SELECT tb_transactions.id, tb_transactions.created_at, tb_transactions.sub_total, tb_products.name AS product FROM tb_transactions JOIN tb_products ON tb_transactions.products_id = tb_products.id';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let listOrder = [];

      for (let [i, result] of results.entries()) {
        result.no = i + 1;
        listOrder.push(result);
      }

      res.render('transaction/cart', {
        title: 'Laragaa | Cart',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        listOrder,
      });
    });
    conn.release();
  });
});

//handle checkout
// router.get('/admin/product/delete/:id', function (req, res) {
//   const { id } = req.params;

//   const query = 'DELETE FROM tb_products WHERE id = ?';

//   dbConnection.getConnection((err, conn) => {
//     if (err) throw err;

//     conn.query(query, [id], (err, results) => {
//       if (err) {
//         req.session.message = {
//           type: 'danger',
//           message: err.message,
//         };
//         res.redirect('/');
//       }

//       req.session.message = {
//         type: 'success',
//         message: 'products successfully deleted',
//       };
//       res.redirect('/admin/product');
//     });

//     conn.release();
//   });
// });

module.exports = router;