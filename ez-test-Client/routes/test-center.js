const roles = require('../config/roles');
const roleConfig = require('../controllers/utils');

module.exports = function(app, passport) {

    /* GET dashboard */
    app.get('/test-center', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.TestCenter),
    function(req, res) {
        res.render('restricted/test-center/home', {
            user : req.user // get the user out of session and pass to template
        });
    });
    
    /* GET patients */
    app.get('/test-center/patients', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.TestCenter),
    function(req, res) {
        res.render('restricted/test-center/patients', {
            user : req.user // get the user out of session and pass to template
        });
    });

    /* GET labs */
    app.get('/test-center/labs', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.TestCenter),
    function(req, res) {
        res.render('restricted/test-center/labs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    /* GET test-sites */
    app.get('/test-center/test-sites', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.TestCenter),
    function(req, res) {
        res.render('restricted/test-center/test-sites', {
            user : req.user // get the user out of session and pass to template
        });
    });

    /* GET profile */
    app.get('/test-center/profile', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.TestCenter),
    function(req, res) {
        res.render('restricted/test-center/profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    /* GET settings */
    app.get('/test-center/settings', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.TestCenter),
    function(req, res) {
        res.render('restricted/test-center/settings', {
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