const roles = require('../config/roles');
const roleConfig = require('../controllers/utils');

module.exports = function(app, passport) {

    /* GET dashboard */
    app.get('/lab', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.Lab),
    function(req, res) {
        res.render('restricted/lab/home', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    /* GET patients */
    app.get('/lab/patients', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.Lab),
    function(req, res) {
        res.render('restricted/lab/patients', {
            user : req.user // get the user out of session and pass to template
        });
    });

    /* GET labs */
    app.get('/lab/labs', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.Lab),
    function(req, res) {
        res.render('restricted/lab/labs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    /* GET test-sites */
    app.get('/lab/test-sites', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.Lab),
    function(req, res) {
        res.render('restricted/lab/test-sites', {
            user : req.user // get the user out of session and pass to template
        });
    });

    /* GET profile */
    app.get('/lab/profile', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.Lab),
    function(req, res) {
        res.render('restricted/lab/profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    /* GET settings */
    app.get('/lab/settings', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.Lab),
    function(req, res) {
        res.render('restricted/lab/settings', {
            user : req.user // get the user out of session and pass to template
        });
    });

}

// ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
  }
	res.redirect('/');
}