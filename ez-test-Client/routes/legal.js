var express = require('express');
var router = express.Router();

/* GET licensing disclaimer */
router.get('/licensing-disclaimer', function(req, res) {
  res.render('unrestricted/legal/licensing-disclaimer', {title: 'Licensing Disclaimer'}); // load the index.ejs file
});

/* GET privacy policy */
router.get('/privacy-policy', function(req, res) {
  res.render('unrestricted/legal/privacy-policy', {title: 'Privacy Policy'}); // load the index.ejs file
});

/* GET terms of service */
router.get('/terms-of-service', function(req, res) {
  res.render('unrestricted/legal/terms-of-service', {title: 'Terms of Service'}); // load the index.ejs file
});

module.exports = router;