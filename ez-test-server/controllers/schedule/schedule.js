const Appointments = require('../sql/appointments');
const Test_Centers = require('../sql/test_centers');
const moment = require('moment');

// builds a matrix of AVAILABLE appointments for arr of locations 
async function buildMatrix(locations) {

    var matrix = [];
    var timePeriod = getTimeTwoTuple(); // [start date, end date]

    for (var y = 0; y < locations.length; y++) {

        const schedule = await getSchedule(locations[y]); // get individual schedule for test center
        const parsedJSON = JSON.parse(schedule[0].schedule); // parse JSON
        var allPossibleSlots = getPreferences(parsedJSON); // generate all possible slots

        // console.log("Length of all possible slots:" + allPossibleSlots.length);

        // get current appointments for test center
        const slots = await getUnavailable(timePeriod[0], timePeriod[1], locations[y][0]);

        // iterate through each day of week
        for (var i = 0; i < allPossibleSlots.length; i++) {

            // check if is open day [i]
            if (allPossibleSlots[i][1] != false) {
                // console.log("Number of possible on day ["+i+"]["+allPossibleSlots[i][1].length+"]");
                // iterate through all possible slots for that day
                for (var j = 0; j < allPossibleSlots[i][1].length; j++) {
                    // iterate through all possible appointments in that time period
                    for (var w = 0; w < slots.length; w++) {
                        // if appointment exists, delete time slot from return arr
                        if (moment(allPossibleSlots[i][1][j]).isSame(slots[w])) {
                            // console.log("Removing ["+allPossibleSlots[i][1][j]+"] on day ["+i+"]");
                            allPossibleSlots[i][1].splice([j], 1);
                            // console.log("Number of possible on day ["+i+"]["+allPossibleSlots[i][1].length+"]");                            
                        }
                    }
                }
            }
        }
        // push test center id + open slots to matrix
        matrix.push({ id: locations[y][0], name: locations[y][2], address: locations[y][3], appointments: allPossibleSlots });
    }
    // console.log(matrix);
    return matrix;
}

// get schedule of test center
async function getSchedule(id) {
    return result = await Promise.resolve(Test_Centers.getSchedule(id));
}

// get slots where test center is not available
async function getUnavailable(start, end, id) {
    return result = await Promise.resolve(Appointments.selectTCenterAppointmentsBetween(start, end, id));
}

function getTestCenterOpenSlots(testCenterID) {

    timePeriod = getTimeTwoTuple(); // [start date, end date]
    var allPossibleSlots = [];

    let schedule = null;
    Test_Centers.selectTestCenterSchedule(testCenterID, function(result) {

        schedule = result;
        var parsedJSON = JSON.parse(schedule[0]);

        allPossibleSlots = getPreferences(parsedJSON);

        console.log("Length of all possible slots:" + allPossibleSlots.length);

        var slots = [];
        Appointments.selectTestCenterAppointmentsBetween(timePeriod[0], timePeriod[1], testCenterID, function(result) {

            slots = result;

            // iterate through each day of week
            for (var i = 0; i < allPossibleSlots.length; i++) {
                // check if is open day [i]
                if (allPossibleSlots[i][1] != false) {
                    console.log("Number of possible on day [" + i + "][" + allPossibleSlots[i][1].length + "]");
                    // iterate through all possible slots for that day
                    for (var j = 0; j < allPossibleSlots[i][1].length; j++) {
                        // iterate through all possible appointments in that time period
                        for (var w = 0; w < slots.length; w++) {
                            // if appointment exists, delete time slot from return arr
                            if (moment(allPossibleSlots[i][1][j]).isSame(slots[w])) {
                                console.log("Removing [" + allPossibleSlots[i][1][j] + "] on day [" + i + "]");
                                allPossibleSlots[i][1].splice([j], 1);
                                console.log("Number of possible on day [" + i + "][" + allPossibleSlots[i][1].length + "]");
                            }
                        }
                    }
                }
            }
        });
    });
}

// Gets start date and end date
function getTimeTwoTuple() {
    // start date (tommorow)
    var d1 = moment().add(1, 'day').format("YYYY-MM-DD");
    var t1 = "00:00:00";
    var tommorow = moment(d1 + ' ' + t1).format("YYYY-MM-DD HH:mm:ss");

    // end date (tommorow + 6)
    var d2 = moment().add(7, 'day').format("YYYY-MM-DD");
    var t2 = "11:59:59";
    var eofPeriod = moment(d2 + ' ' + t2).format("YYYY-MM-DD HH:mm:ss");
    return [tommorow, eofPeriod];
}

// gets array of all possible time slots for 7 days
function getPreferences(parsedJSON) {

    var dates = getNextSevenDays();
    var daySlots = [];

    for (var i = 0; i < 7; i++) {

        var day = parsedJSON[i];
        var state = day['state']; // console.log('State: ' + state);
        var start = day['start']; // console.log('End: ' + end);
        var end = day['end']; // console.log("On day [" + i + "], the following appts:");

        var date = dates[i];

        if (state == 'true') {
            // daySlots.push(moment(date + ' ' + getTimeStops(start, end)).format("YYYY-MM-DD HH:mm:ss"));
            daySlots.push([i, getTimeStops(date, start, end)]);
        } else {
            daySlots.push([i, false]);
        }
        // console.log(daySlots[i]);
    }
    return (daySlots);
}

// getPreferences() helper - generates array of all possible items for ONE day
function getTimeStops(date, start, end) {

    var startTime = moment(date);
    startTime.set({ hour: start, minute: 00, second: 00 });

    var endTime = moment(date);
    endTime.set({ hour: end, minute: 59, second: 59 });

    var timeStops = [];

    while (startTime <= endTime) {
        timeStops.push(new moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
        startTime.add(15, 'minutes');
    }
    return timeStops;
}

// getPreferences() helper - generates array of moment date obj going 7 days forward
function getNextSevenDays() {
    nextSevenDays = [];
    for (var i = 1; i < 8; i++) {
        var x = moment().add(i, 'day').format('YYYY-MM-DD HH:mm:ss');
        nextSevenDays.push(x);
    } // console.log(nextSevenDays);
    return nextSevenDays;
}

exports.buildMatrix = buildMatrix;