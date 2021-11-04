let express = require('express');
let router = express.Router();

let Distance = require('../controllers/schedule/distance.js');
let Schedule = require('../controllers/schedule/schedule.js');
let Appointment = require('../controllers/sql/appointments.js');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/', (request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    let obj = JSON.parse(JSON.stringify(request.body));
    Appointment.insertAppointment(obj.patientID, obj.testCenterID, obj.dateTime);
    
});

router.get('/:zip', (request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Distance.getTCenters()
    .then(data=> {
        Distance.getZipCord(request.params.zip).then(origin => {
            Distance.getWithinRadius(origin, data)
            .then(ordered => {
                Schedule.buildMatrix(ordered)
                .then(matrix => {
                    response.send(JSON.stringify(matrix));
                });
            });
        });
    });
} );

module.exports = router;