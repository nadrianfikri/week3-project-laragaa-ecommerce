const router = require('express').Router();
const dbConnection = require('../connection/db');
const uploadFile = require('../middlewares/uploadFile');
const pathFile = 'http://localhost:7000/uploads/';

// render admin dashboard page
router.get('/admin', function (req, res) {
  // if (!req.session.isAdmin) {
  //   req.session.message = {
  //     type: 'danger',
  //     message: 'your is not admin',
  //   };

  //   return res.redirect('/');
  // }

  const query = 'SELECT * FROM tb_users WHERE status = 0';
  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, function (err, results) {
      if (err) throw err;

      const customers = results.map((result) => result);

      conn.query('SELECT * FROM tb_transactions', function (err, results) {
        if (err) throw err;

        const transactions = results.map((result) => result);

        conn.query('SELECT * FROM tb_payments', function (err, results) {
          if (err) throw err;

          const payments = results.map((result) => result);

          res.render('admin/admin', {
            title: 'Laragaa | Admin',
            isLogin: req.session.isLogin,
            isAdmin: req.session.isAdmin,
            customers,
            transactions,
            payments,
          });
        });
      });
    });
    conn.release();
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

      const manageOrder = results.map((result, i) => {
        result.no = i + 1;
        return result;
      });

      res.render('admin/manageorder', { title: 'Laragaa | Admin Daftar Pesanan', isLogin: req.session.isLogin, manageOrder });
    });
    conn.release();
  });
});

// ------------------DETAIL ORDER------------------
router.get('/admin/detailorder/:id', function (req, res) {
  if (!req.session.isAdmin) {
    req.session.message = {
      type: 'danger',
      message: 'your is not admin',
    };

    return res.redirect('/');
  }

  const { id } = req.params;

  const query =
    'SELECT tb_transactions.id AS id, tb_transactions.sub_total as subTotal, tb_products.name AS product, tb_products.photo AS photo, tb_users.name AS user, tb_users.address AS address FROM tb_transactions  JOIN tb_products ON tb_products.id =  tb_transactions.products_id JOIN tb_users ON tb_users.id = tb_transactions.users_id WHERE id = ?';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) throw err;

      const detailorder = results.map((result, i) => {
        result.photo = pathFile + result.photo;
        result.no = i + 1;
        return result;
      });

      res.render('admin/detailorder', { title: 'Laragaa | Admin Daftar Pesanan', isLogin: req.session.isLogin, detailorder });
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

      const manageCategory = results.map((result, i) => {
        result.no = i + 1;
        return result;
      });

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

      const manageBrand = results.map((result, i) => {
        result.no = i + 1;
        return result;
      });

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
  // if (!req.session.isAdmin) {
  //   req.session.message = {
  //     type: 'danger',
  //     message: 'your is not admin',
  //   };

  //   return res.redirect('/');
  // }
  const query =
    'SELECT tb_products.photo, tb_products.id, tb_products.name AS productName, tb_products.price, tb_products.description, tb_products.stock, tb_products.created_at,  tb_categories.name AS categoryName FROM tb_products JOIN tb_categories ON tb_products.categories_id = tb_categories.id';
  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, (err, results) => {
      if (err) throw err;

      const manageProduct = results.map((result, i) => {
        result.photo = pathFile + result.photo;
        result.created_at = result.created_at.toLocaleString('id-ID');

        result.no = i + 1;
        return result;
      });

      res.render('admin/product', { title: 'Laragaa | Admin Daftar Produk', isLogin: req.session.isLogin, manageProduct });
    });
    conn.release();
  });
});

// post manageProduct
router.post('/admin/product', uploadFile('photo'), function (req, res) {
  let { productName, categoryName, price, stock, brand, description } = req.body;
  let photo = req.file.filename;

  const query = 'INSERT INTO tb_products(name, description, price, photo, stock, brands_id, categories_id) VALUES (?,?,?,?,?,?,?)';

  dbConnection.getConnection((err, conn) => {
    conn.query(query, [productName, description, price, photo, stock, brand, categoryName], (err, results) => {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'add product successfull',
      };
      res.redirect('/admin/product');
    });

    conn.release();
  });
});

// render update product
router.get('/admin/product/edit/:id', function (req, res) {
  const { id } = req.params;

  const query = 'SELECT * FROM tb_products WHERE id = ?';

  dbConnection.getConnection((err, conn) => {
    if (err) throw err;

    conn.query(query, [id], (err, results) => {
      if (err) throw err;

      const product = results[0];

      res.render('admin/product-edit', {
        title: 'Laragaa | Admin Product edit',
        isLogin: req.session.isLogin,
        isAdmin: req.session.isAdmin,
        product,
      });
    });
    conn.release();
  });
});

//handle update product
router.post('/admin/product/edit/:id', uploadFile('photo'), function (req, res) {
  let { id, productName, categoryName, price, stock, brand, description } = req.body;

  let photo = oldImage.replace(pathFile, '');

  if (req.file) {
    photo = req.file.filename;
  }

  const query = 'UPDATE tb_products SET name = ?, description = ?, price = ?, photo = ?, stock = ?, brands_id = ?, categories_id = ? WHERE id = ?';

  dbConnection.getConnection((err, conn) => {
    conn.query(query, [productName, description, price, photo, stock, brand, categoryName, id], (err, results) => {
      if (err) throw err;

      req.session.message = {
        type: 'success',
        message: 'update product successfull',
      };
      res.redirect('/admin/product');
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
        message: 'products successfully deleted',
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

      const manageCustomer = results.map((result, i) => {
        result.no = i + 1;
        return result;
      });

      res.render('admin/customer', { title: 'Laragaa | Admin Daftar Pelanggan', isLogin: req.session.isLogin, manageCustomer });
    });
    conn.release();
  });
});

module.exports = router;
