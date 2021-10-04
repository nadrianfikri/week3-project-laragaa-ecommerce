const multer = require('multer');

module.exports = (image) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === image) {
      if (!file.originalname.match(/\.(jpg|JPG|png|PNG|svg|SVG)$/)) {
        req.fileValidationError = {
          message: 'Only image files are allowed',
        };

        return cb(new Error('Only image files are allowed', false));
      }
    }

    cb(null, true);
  };

  const sizeMB = 15;
  const maxSize = sizeMB * 1024 * 1024;

  //   upload func
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(image);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        if (err.code == 'LIMIT_FILE_SIZE') {
          req.session.message = {
            type: 'danger',
            message: 'Error, max file size is 15MB',
          };
          return res.redirect(req.originalUrl);
        }

        req.session.message = {
          type: 'danger',
          message: 'upload file error',
        };
        return res.redirect(req.originalUrl);
      }
      return next();
    });
  };
};
