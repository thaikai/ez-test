const Appointments = require('./sql/appointments');
const Test_Centers = require('./sql/test_centers');
const moment = require('moment');

// ************************************************************************
// This file populates the patient dashboard using API calls
// ************************************************************************

async function getAppointments(patientID){

    const appointments = await getPatientAppointments(patientID);

    var upcoming = [];
    var previous = [];
    
    for (var i = 0; i < appointments.length; i++){
        
        var testCenterID = appointments[i][0];                  // test center id
        var dateTime_Raw = appointments[i][1];                  // raw dateTime
        var dateTime_Pretty = formatDateTime(dateTime_Raw);     // pretty dateTime
        var result = formatTestResult(appointments[i][2]);      // pretty test result

        var testCenterName = await getTestCenterName(testCenterID);         // test center name
        var testCenterAddress = await getTestCenterAddress(testCenterID);   // test center address
        var appointment = { testCenter: testCenterName , address: testCenterAddress , dateTime: dateTime_Pretty, result: result };
        
        isPreviousAppointment(dateTime_Raw) ? previous.push(appointment) : upcoming.push(appointment);        

    }

    return {upcoming, previous};

}

// get all appointments associated with patientID
async function getPatientAppointments(patientID) {
    return result = await Promise.resolve(Appointments.selectUserAppointments(patientID));
}

// get test center address
async function getTestCenterAddress(testCenterID) {
    return result = await Promise.resolve(Test_Centers.selectTestCenterAddress(testCenterID));
}

// get test center name
async function getTestCenterName(testCenterID) {
    return result = await Promise.resolve(Test_Centers.selectTestCenterName(testCenterID));
}

// return true if dateTime is before NOW
function isPreviousAppointment(dateTime) {

    var now = moment().format("YYYY-MM-DD HH:mm:ss");
    var appointmentDT = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
    
    if(moment(appointmentDT).isBefore(now)){
        return true;
    } else {
        return false;
    }
}

// prettify dateTime
function formatDateTime(dateTime){
    return moment(dateTime).format('dddd, MMMM Do YYYY, h:mm:ss a');
}

// prettify test result
function formatTestResult(res) {
    return res == 0  ? 'Positive'
         : res == 1 ? 'Negative'
         : res == null ? 'Pending'
         : 'Pending';
}

// file exports
exports.getAppointments = getAppointments;