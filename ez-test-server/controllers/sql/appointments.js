var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.connect();
connection.query('USE ' + dbconfig.database);

// ************************************************************************
// APPOINTMENTS TABLE   |
// ---------------------
// id             =: BIGINT
// patientID      =: INT
// testCenterID   =: INT
// labID          =: INT
// dateTime       =: DATETIME
// testResult     =: TINYINT(1)
// ************************************************************************

// INSERT APPOINTMENT INTO TABLE
const insertAppointment = (patientID, testCenterID, dateTime) => {
    var insertQuery = "INSERT INTO appointments ( patientID, testCenterID, dateTime ) values (?,?,?)";
    connection.query(insertQuery, [patientID, testCenterID, dateTime], function(err, rows) {
        if (err) throw err;
        console.log("Appointment successfully inserted.");
    });
}

// SELECT APPOINTMENTS WITH MATCHING USER ID
// const selectUserAppointments = (patientID) => {
//     var selectQuery = "SELECT * FROM appointments WHERE patientID = ?";
//     connection.query(selectQuery, patientID, function(err, rows) {
//         if (err) throw err;
//         console.log(rows);
//     });
// }

// SELECT APPOINTMENTS WITH MATCHING USER ID - MORE FRIENDLY
function selectUserAppointments(patientID) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM appointments WHERE patientID = ?", [patientID],
            (err, result) => {
                if (err) throw err;
                var appointments = [];
                for (var i = 0; i < result.length; i++) {
                    appointments.push([result[i].testCenterID, result[i].dateTime, result[i].testResult]);
                }
                return resolve(appointments);
            }
        );
    });
}

// SELECT * AT SPECIFIC DATE:TIME
const selectAppointments = (dt) => {
    var selectQuery = "SELECT * FROM appointments WHERE dateTime = ?";
    connection.query(selectQuery, dt, function(err, rows) {
        if (err) throw err;
        console.log(rows);
    });
}

// SELECT * AT RANGE DATE:TIME
function selectAppointmentsBetween(start, end) {
    var selectQuery = "SELECT * FROM appointments WHERE dateTime BETWEEN ? and ?";
    connection.query(selectQuery, [start, end], function(err, rows) {
        if (err) throw err;
        console.log(rows);

    });
}

// SELECT * AT RANGE DATE:TIME
function selectTestCenterAppointmentsBetween(start, end, id, callback) {

    var selectQuery = "SELECT * FROM appointments" +
        " WHERE dateTime BETWEEN ? and ?" +
        " AND testCenterID = ?";

    var slots = [];
    connection.query(selectQuery, [start, end, id], function(err, rows) {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            slots.push(rows[i].dateTime);
        }
        return callback(slots);
    });
}

// SELECT * FOR TESTCENTERID AND APPT BETWEEN START, END
function selectTCenterAppointmentsBetween(start, end, id) {

    var selectQuery = "SELECT * FROM appointments" +
        " WHERE dateTime BETWEEN ? and ?" +
        " AND testCenterID = ?";

    var slots = [];
    connection.query(selectQuery, [start, end, id], function(err, rows) {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            slots.push(rows[i].dateTime);
        }
        return callback(slots);
    });
}

// SELECT * FOR TESTCENTERID AND APPT BETWEEN START, END - MORE FRIENDLY
function selectTCenterAppointmentsBetween(start, end, id) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM appointments WHERE dateTime BETWEEN ? and ? AND testCenterID = ?", [start, end, id],
            (err, result) => {
                if (err) throw err;

                var slots = [];
                for (var i = 0; i < result.length; i++) {
                    slots.push(result[i].dateTime);
                }
                return resolve(slots);
            }
        );
    });
}

exports.insertAppointment = insertAppointment;

exports.selectAppointments = selectAppointments;
exports.selectUserAppointments = selectUserAppointments;
exports.selectTestCenterAppointmentsBetween = selectTestCenterAppointmentsBetween;

exports.selectTCenterAppointmentsBetween = selectTCenterAppointmentsBetween;