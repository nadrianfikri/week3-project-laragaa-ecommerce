const router = require('express').Router();
const dbConnection = require('../connection/db');

// render admin dashboard page
router.get('/admin', function (req, res) {
  if (!req.session.isAdmin) {
    req.session.message = {
      type: 'danger',
      message: 'your is not admin',
    };

    return res.redirect('/');
  }

  res.render('admin/admin', {
    title: 'Laragaa | Admin',
    isLogin: req.session.isLogin,
    isAdmin: req.session.isAdmin,
  });
});

// ---------------------MANAGE ORDER--------------------------------

// render manage order page
router.get('/admin/manageorder', function (req, res) {
  if (!req.session.isAdmin) {
    req.session.message = {
      type: 'danger',
      message: 'your is not admin',
    };

    return res.redirect('/');
  }

  const query = 'SELECT tb_transactions.id, tb_transactions.created_at, tb_transactions.sub_total, tb_users.name FROM tb_transactions JOIN tb_users ON tb_transactions.users_id = tb_users.id';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let manageOrder = [];

      for (let [i, result] of results.entries()) {
        result.no = i + 1;
        manageOrder.push(result);
      }

      res.render('admin/manageorder', { title: 'Laragaa | Admin Daftar Pesanan', isLogin: req.session.isLogin, manageOrder });
    });
    conn.release();
  });
});

// ---------------------MANAGE CATEGORY--------------------------------

// render category page
router.get('/admin/category', function (req, res) {
  if (!req.session.isAdmin) {
    req.session.message = {
      type: 'danger',
      message: 'your is not admin',
    };

    return res.redirect('/');
  }

  const query = 'SELECT * FROM tb_categories';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let manageCategory = [];

      for (let [i, result] of results.entries()) {
        result.no = i + 1;
        manageCategory.push(result);
      }

      res.render('admin/category', { title: 'Laragaa | Admin Daftar Kategori', isLogin: req.session.isLogin, manageCategory });
    });
    conn.release();
  });
});

// post category
router.post('/admin/category', function (req, res) {
  const { name } = req.body;

  const query = 'INSERT INTO tb_categories(name) VALUES (?)';

  dbConnection.getConnection((err, conn) => {
    conn.query(query, [name], (err, results) => {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'add category successfull',
      };
      res.redirect('/admin/category');
    });

    conn.release();
  });
});
// ---------------------MANAGE BRANDS--------------------------------

// render brand page
router.get('/admin/brand', function (req, res) {
  if (!req.session.isAdmin) {
    req.session.message = {
      type: 'danger',
      message: 'your is not admin',
    };

    return res.redirect('/');
  }
  const query = 'SELECT * FROM tb_brands';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let manageBrand = [];

      for (let [i, result] of results.entries()) {
        result.no = i + 1;
        manageBrand.push(result);
      }

      res.render('admin/brand', { title: 'Laragaa | Admin Daftar Brand', isLogin: req.session.isLogin, manageBrand });
    });
    conn.release();
  });
});

// post brand
router.post('/admin/brand', function (req, res) {
  const { name } = req.body;

  const query = 'INSERT INTO tb_brands(name) VALUES (?)';

  dbConnection.getConnection((err, conn) => {
    conn.query(query, [name], (err, results) => {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'add category successfull',
      };
      res.redirect('/admin/brand');
    });

    conn.release();
  });
});

// ---------------------MANAGE PRODUCT--------------------------------
// render admin product page
router.get('/admin/product', function (req, res) {
  if (!req.session.isAdmin) {
    req.session.message = {
      type: 'danger',
      message: 'your is not admin',
    };

    return res.redirect('/');
  }
  const query =
    'SELECT tb_products.photo, tb_products.id, tb_products.name AS productName, tb_products.price, tb_products.description, tb_products.created_at,  tb_categories.name AS categoryName, tb_brands.name AS brandName FROM tb_products JOIN tb_categories ON tb_products.categories_id = tb_categories.id JOIN tb_brands ON tb_products.brands_id = tb_brands.id';
  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let manageProduct = [];

      for (let [i, result] of results.entries()) {
        result.no = i + 1;
        manageProduct.push(result);
      }

      res.render('admin/product', { title: 'Laragaa | Admin Daftar Produk', isLogin: req.session.isLogin, manageProduct });
    });
    conn.release();
  });
});

// handle delete product
router.get('/admin/product/delete/:id', function (req, res) {
  const { id } = req.params;

  const query = 'DELETE FROM tb_products WHERE id = ?';

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
        message: 'article successfully deleted',
      };
      res.redirect('/admin/product');
    });

    conn.release();
  });
});

// ---------------------MANAGE CUSTOMER--------------------------------

// render customer page
router.get('/admin/customer', function (req, res) {
  if (!req.session.isAdmin) {
    req.session.message = {
      type: 'danger',
      message: 'your is not admin',
    };

    return res.redirect('/');
  }
  const query = 'SELECT * FROM tb_users WHERE status = 0';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      let manageCustomer = [];

      for (let [i, result] of results.entries()) {
        result.no = i + 1;
        manageCustomer.push(result);
      }

      res.render('admin/customer', { title: 'Laragaa | Admin Daftar Pelanggan', isLogin: req.session.isLogin, manageCustomer });
    });
    conn.release();
  });
});

module.exports = router;
