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

    return res.redirect('/');
  }
  const query = 'SELECT tb_transactions.id, tb_transactions.created_at, tb_transactions.sub_total, tb_users.name FROM tb_transactions JOIN tb_users ON tb_transactions.users_id = tb_users.id';

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

module.exports = router;
