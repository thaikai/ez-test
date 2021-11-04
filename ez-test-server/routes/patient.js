let express = require('express');
let router = express.Router();

let Patient = require('../controllers/patient.js');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.get('/:pid', (request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    Patient.getAppointments(request.params.pid)
    .then(data=>{
        response.send(JSON.stringify(data));
    });
    
});

module.exports = router;