const router = require('express').Router();
const dbConnection = require('../connection/db');
const pathFile = 'http://localhost:7000/uploads/';
const uploadFile = require('../middlewares/uploadFile');

// render cart
router.get('/cart', function (req, res) {
  if (!req.session.isLogin) {
    req.session.message = {
      type: 'danger',
      message: 'you must be login',
    };

    return res.redirect('/login');
  }

  const users_id = req.session.user.id;

  const query =
    'SELECT tb_transactions.id, tb_transactions.sub_total, tb_products.name AS product, tb_products.price AS price, tb_products.photo as photo, tb_products.id AS productId FROM tb_transactions JOIN tb_products ON tb_transactions.products_id = tb_products.id WHERE users_id = ?';
  //

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [users_id], (err, results) => {
      if (err) throw err;

      let cart = results.map((result, i) => {
        let ongkir = 10000;
        let reverse = result.price.toString().split('').reverse().join('');
        let regex = reverse.match(/\d{1,3}/g);
        let newPrice = regex.join('.').split('').reverse().join('');

        result.photo = pathFile + result.photo;
        result.totalPrice = result.price + ongkir;
        result.displayPrice = newPrice;
        result.no = i + 1;
        return result;
      });

      // const ongkir = 10000;
      // let totalPrice = 0;
      // totalPrice +=
      //   cart
      //     .map((result) => {
      //       return result.price;
      //     })
      //     .reduce((acc, cur) => acc + cur) + ongkir;

      // regex
      // let reverse = totalPrice.toString().split('').reverse().join('');
      // let regex = reverse.match(/\d{1,3}/g);
      // let newPrice = regex.join('.').split('').reverse().join('');

      // const displayTotal = newPrice;

      res.render('transaction/cart', {
        title: 'Laragaa | Cart',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        user: req.session.user,
        cart,
      });
    });
    conn.release();
  });
});

// handle add cart
router.post('/product/add-cart', function (req, res) {
  if (!req.session.isLogin) {
    req.session.message = {
      type: 'danger',
      message: 'you must be login',
    };

    return res.redirect('/login');
  }
  const { price, productId, userId } = req.body;

  const query = 'INSERT INTO tb_transactions(sub_total, products_id, users_id) VALUES(?,?,?)';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [price, productId, userId], function (err, results) {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'Product add to cart successfull',
      };
      res.redirect(`/product/${productId}`);
    });
    conn.release();
  });
});
// handle delete cart
router.get('/cart/delete/:id', function (req, res) {
  const { id } = req.params;

  const query = 'DELETE FROM tb_transactions WHERE id = ?';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) {
        req.session.message = {
          type: 'danger',
          message: err.message,
        };
        res.redirect('/');
      }

      req.session.message = {
        type: 'success',
        message: 'products successfully deleted',
      };
      res.redirect('/cart');
    });

    conn.release();
  });
});

// checkout
router.get('/checkout', function (req, res) {
  if (!req.session.isLogin) {
    req.session.message = {
      type: 'danger',
      message: 'you must be login',
    };

    return res.redirect('/login');
  }

  const users_id = req.session.user.id;

  const query =
    'SELECT tb_transactions.id, tb_products.name AS product, tb_products.price AS price, tb_products.photo as photo, tb_payments.id AS paymentId, tb_payments.sub_total, tb_payments.qty FROM tb_transactions JOIN tb_products ON tb_transactions.products_id = tb_products.id JOIN tb_payments ON tb_transactions.id = tb_payments.transactions_id WHERE users_id = ?';
  //

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [users_id], (err, results) => {
      const { qty } = req.body;
      if (err) throw err;

      let orderPayment = results.map((result, i) => {
        let reverse = result.price.toString().split('').reverse().join('');
        let regex = reverse.match(/\d{1,3}/g);
        let newPrice = regex.join('.').split('').reverse().join('');

        result.photo = pathFile + result.photo;
        result.displayPrice = newPrice;
        result.no = i + 1;
        return result;
      });

      const ongkir = 10000;
      const totalPrice =
        orderPayment
          .map((result) => {
            return result.price;
          })
          .reduce((acc, cur) => acc + cur) + ongkir;

      res.render('transaction/checkout', {
        title: 'Laragaa | Checkout',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        user: req.session.user,
        orderPayment,
        totalPrice,
      });
    });
    conn.release();
  });
});

// handle payment
router.post('/checkout', function (req, res) {
  const { totalPrice, qty, transId } = req.body;

  const query = 'INSERT INTO tb_payments( sub_total, qty, transactions_id) VALUES(?,?,?)';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [totalPrice, qty, transId], function (err, results) {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'Checkout successfull',
      };
      res.redirect(`/checkout`);
    });
    conn.release();
  });
});

//render listorder
router.get('/listorder', function (req, res) {
  // if (!req.session.isLogin) {
  //   req.session.message = {
  //     type: 'danger',
  //     message: 'you must be login',
  //   };
  //   return res.redirect('/login');
  // }

  // const users_id = req.session.user.id;

  const query =
    'SELECT tb_transactions.id, tb_transactions.sub_total, tb_products.name AS product, tb_products.price AS price, tb_products.photo as photo, tb_products.id AS productId FROM tb_transactions JOIN tb_products ON tb_transactions.products_id = tb_products.id ';
  //WHERE users_id = ?

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let orderPayment = results.map((result, i) => {
        let reverse = result.price.toString().split('').reverse().join('');
        let regex = reverse.match(/\d{1,3}/g);
        let newPrice = regex.join('.').split('').reverse().join('');

        result.photo = pathFile + result.photo;
        result.displayPrice = newPrice;
        result.no = i + 1;
        return result;
      });

      res.render('transaction/listorder', {
        title: 'Laragaa | List Order',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        user: req.session.user,
        orderPayment,
      });
    });
    conn.release();
  });
});

//handle confirm payments
router.post('/payment/confirm', uploadFile('photo'), function (req, res) {
  let { id, name } = req.body;
  let photo = req.file.filename;

  const query = 'UPDATE tb_payments SET name = ?, photo = ?,  WHERE id = ?';

  dbConnection.getConnection((err, conn) => {
    conn.query(query, [name, photo, id], (err, results) => {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'confirm payments successfull',
      };
      res.redirect('/');
    });

    conn.release();
  });
});

module.exports = router;
