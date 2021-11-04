// ************************************************************************
// TEST CENTER TABLE
// ************************************************************************
var mysql = require('mysql');
var dbconfig = require('../../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.connect();
connection.query('USE ' + dbconfig.database);

// ************************************************************************
// SCHEDULE
// ************************************************************************

// SELECT stringified JSON with test center schedule
function selectTestCenterSchedule(id, callback) {
    var selectQuery = "SELECT schedule FROM test_centers" +
        " WHERE id = ?";

    var schedule = [];
    connection.query(selectQuery, id, function(err, rows) {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            schedule.push(rows[i].schedule);
        }
        return callback(schedule);
    });
}

// SET test center schedule
function updateTestCenterSchedule(jsonString, id) {
    var updateQuery = "UPDATE test_centers" +
        " SET schedule = ?" +
        " WHERE id = ?";

    connection.query(updateQuery, [jsonString, id], function(err, rows) {
        if (err) throw err;
        console.log("Schedule updated for test center [" + id + "]");
    });
}

// ************************************************************************
// ADDRESS
// ************************************************************************

// --deprecated for more callback friendly version 
// selectAllTestCenterAddresses();
// function selectAllTestCenterAddresses(){
//     var selectQuery = "SELECT * FROM test_centers WHERE address IS NOT NULL";

//     connection.query(selectQuery, function(err, rows) {
//         if (err) throw err;
//         console.log(rows);
//     });   
// }

function selectAllTestCenterAddresses(callback) {
    var selectQuery = "SELECT * from test_centers" +
        " WHERE address IS NOT NULL";

    var locations = [];
    connection.query(selectQuery, function(err, rows) {
        if (err) throw err;

        for (var i = 0; i < rows.length; i++) {
            locations.push([rows[i].id, rows[i].address]);
        }
        return callback(locations);
    });
}

function getSchedule(id) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT schedule FROM test_centers WHERE id = ?",
            id,
            (err, result) => {
                return err ? reject(err) : resolve(result);
            }
        );
    });
}

function selectTestCenterName(id) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT name FROM test_centers WHERE id = ?",
            id,
            (err, result) => {
                return err ? reject(err) : resolve(result[0].name);
            }
        );
    });
}

function selectTestCenterAddress(id) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT address FROM test_centers WHERE id = ?",
            id,
            (err, result) => {
                return err ? reject(err) : resolve(result[0].address);
            }
        );
    });
}

function getTestCenters() {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * from test_centers WHERE address IS NOT NULL",
            (err, result) => {
                return err ? reject(err) : resolve(result);
            }
        );
    });
}

const selectAllTestCenters = async() => {
    var selectQuery = "SELECT * from test_centers" +
        " WHERE address IS NOT NULL";

    var locations = [];
    connection.query(selectQuery, function(err, rows) {
        if (err) throw err;
        for (var i = 0; i < rows.length; i++) {
            locations.push([rows[i].id, rows[i].address]);
        }
    });
    return locations;
}

function updateTestCenterAddress(jsonString, id) {
    var updateQuery = "UPDATE test_centers" +
        " SET address = ?" +
        " WHERE id = ?";

    connection.query(updateQuery, [jsonString, id], function(err, rows) {
        if (err) throw err;
        console.log("Address updated for test center [" + id + "]");
    });
}

// name/address
exports.selectTestCenterName = selectTestCenterName;
exports.selectTestCenterAddress = selectTestCenterAddress;

// schedule
exports.updateTestCenterSchedule = updateTestCenterSchedule;
exports.selectTestCenterSchedule = selectTestCenterSchedule;
exports.getSchedule = getSchedule;

// misc
exports.updateTestCenterAddress = updateTestCenterAddress;
exports.selectAllTestCenterAddresses = selectAllTestCenterAddresses;
exports.selectAllTestCenters = selectAllTestCenters;
exports.getTestCenters = getTestCenters;