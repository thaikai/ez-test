// app/routes.js
const roles = require('../config/roles');
const roleConfig = require('../controllers/utils');
const axios = require('axios');

module.exports = function(app, passport) {

  require("./patient")(app, passport);
  require("./lab")(app, passport);
  require("./test-center")(app, passport);
  
  /* GET home */
  app.get('/', function(req, res, next) {
    res.render('unrestricted/index', {title: 'Home'});
  });

  /* GET booking page */
  app.get('/book', function(req, res) {
    res.render('unrestricted/book', { title: 'Schedule Test', message: req.flash('signupMessage') });
  });

  /* GET login */
  app.get('/login', function(req, res) {
    res.render('unrestricted/login', { message: req.flash('loginMessage') , title: 'Login'});
  });
  
  /* GET signup -- deprecated */
  // app.get('/signup', function(req, res) {
  //   res.render('unrestricted/signup', { message: req.flash('signupMessage') }, {title: 'Sign Up'});
  // });
  
  /* GET results -- deprecated */
  // app.get('/view-results', function(req, res) {
  //   res.render('unrestricted/view-results', {title: 'View Results'});
  // });

  /* GET logout */ 
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  /* POST login =: checks and routes the right acct dashboard */
  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { 
        return next(err); 
      }
      if (!user) { 
        return res.redirect('/login'); 
      }
      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        }
        return res.redirect(roleConfig.getRedirectUrl(req.user.role));
      });
    })(req, res, next);
  });

  /* POST login =: checks and routes the right acct dashboard */
  app.post('/appointment-login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { 
        return next(err); 
      }
      if (!user) { 
        return res.redirect('/book'); 
      }
      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        }
        const appointment = {
          patientID: user.id,
          testCenterID: req.body.testCenterID,
          dateTime: req.body.dateTime      
        }       
        postAppointment(appointment);

        return res.redirect(roleConfig.getRedirectUrl(req.user.role));
      });
    })(req, res, next);
  });

  /* POST signup =: registers user as patient */
  app.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/book'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
      
        const appointment = {
          patientID: user.id,
          testCenterID: req.body.testCenterID,
          dateTime: req.body.dateTime      
        }       
        postAppointment(appointment);

        return res.redirect('/patient');
      });
    })(req, res, next);     
  });
}

// post user's new appointment
function postAppointment(appointment){ 
  axios({
    method: 'post',
    url: 'http://localhost:8000/api/appointments',
    data: appointment
  });
}