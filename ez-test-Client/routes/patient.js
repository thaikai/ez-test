const roles = require('../config/roles');
const roleConfig = require('../controllers/utils');
const axios = require('axios');

module.exports = function(app, passport) {
    
    /* GET dashboard */
    app.get('/patient', isLoggedIn, roleConfig.checkIsInRole(roles.ROLES.Patient),
    async function(req, res) {
        var appointments = await getAppointments(req.user.id);
        res.render('restricted/patient/home', {
            title: 'Dashboard',
            user : req.user, // get the user out of session and pass to template
            appts: appointments
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

// get appointments associated with user id 
function getAppointments(pid){
    return new Promise((resolve, reject) => {
        var link = 'http://localhost:8000/api/patient/'+pid; 
        axios.get(link)
        .then((response) => {
            return resolve(response.data);
        }); 
    });
}