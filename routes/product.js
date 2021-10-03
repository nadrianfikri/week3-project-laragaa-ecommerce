const router = require('express').Router();

// render product page
router.get('/product', function (req, res) {
  res.render('product/product', { title: 'Laragaa | Product', isLogin: true });
});

// render detail product
router.get('/:id', function (req, res) {
  const { id } = req.params;

  res.render('product/detail', { title: 'Laragaa | Product', isLogin: true, id });
});

module.exports = router;
