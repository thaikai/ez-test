/**
 * Configures LocalStrategy used to for App Authentication
 */

var LocalStrategy = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.connect();
connection.query('USE ' + dbconfig.database);

// expose function to app using module.exports
module.exports = function(passport) {

    // serialize user for session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user for session
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });
    
    /**
     * SIGNUP:
     * 1. Check if user already exists (based on email)
     * 2. If not, create new user, encrypt password, and insert into users table
     */
    passport.use(
        'local-signup',
        new LocalStrategy({
            // override default local strategy to use email/pass instead of username/pass
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true    // allows passing back the entire request to the callback
        },
        function(req, username, password, done) {
            connection.query("SELECT * FROM users WHERE username = ?", [username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    var newUserMysql = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: username,
                        password: bcrypt.hashSync(password, null, null),
                        role: 'patient'
                    };
                    var insertQuery = "INSERT INTO users ( firstName, lastName, username, password, role ) values (?,?,?,?,?)";
                    connection.query(insertQuery,[newUserMysql.firstName, newUserMysql.lastName, newUserMysql.username, newUserMysql.password, newUserMysql.role],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                        // setRole(newUserMysql.username);
                    });
                }
            });
        })
    );

    /**
     * LOGIN:
     * 1. Check if user already exists, flash err if not
     * 2. If user exists but password is incorrect, flassh err
     * 3. If user exists and password is correct, return success
     */
    passport.use(
        'local-login',
        new LocalStrategy({
            // override default local strategy to use email/pass instead of username/pass
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true    // allows passing back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?", [username] , function(err, rows){
                if (err){
                    console.log("error!");
                    return done(err);
                }
                if (!rows.length) {
                    console.log("no user found");
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is exists but password is incorrect
                if (!bcrypt.compareSync(password, rows[0].password)){
                    console.log("wrong password");
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                
                // if user exists ans password is correct
                return done(null, rows[0]);
            });
        })
    );
};

// -- deprecated, roles now automatically set 
// to 'patient' inside local sign up strategy
 
// function setRole(username){
//     let sql = `UPDATE users
//            SET role = ?
//            WHERE username = ?`;
    
//     let data = ["patient", username];

//     connection.query(sql, data, (error, results, fields) => {
//     if (error){
//         return console.error(error.message);
//     }
//     console.log('Rows affected:', results.affectedRows);
//     });
// }