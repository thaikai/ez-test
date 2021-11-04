const roles = require('../config/roles');

const checkIsInRole = (...roles) => (req, res, next) => {
    if (!req.user) {
      console.log("!req.user");  
      return res.redirect('/login')
    }
    const hasRole = roles.find(role => req.user.role === role)
    
    if (!hasRole) {
      console.log("! hasRole");  
      return res.redirect('/login')
    }
    return next()
}

const getRedirectUrl = role => {  
    switch (role) {
      case roles.ROLES.Patient:
        return '/patient'
      case roles.ROLES.Lab:
        return '/lab'
      case roles.ROLES.TestCenter:
        return '/test-center'
      default:
        return '/'
    }
}

module.exports = { 
  checkIsInRole, 
  getRedirectUrl,
};