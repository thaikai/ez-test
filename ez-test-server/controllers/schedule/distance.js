const Test_Centers = require('../sql/test_centers');
const geolib = require('geolib');
const NodeGeocoder = require('node-geocoder');

const config = {
    provider: 'google',
    apiKey: 'AIzaSyDzyICZHeBtAp7zoiCf8387hD4UxCdtmWI', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(config);

// get coordinates using zipcode
const getZipCord = async(packet) => {
    var pack = packet;
    var zipCord = '';
    const response = await geocoder.geocode(pack, function(err, res) {
        zipCord = { latitude: res[0].latitude, longitude: res[0].longitude };
    });
    return zipCord;
};

// get all test centers
async function getTCenters() {
    return result = await Promise.resolve(Test_Centers.getTestCenters());
}

// get test centers within 5km radius of origin
async function getWithinRadius(origin, locations) {

    let eligibleLocations = [];
    let ordered = [];

    for (var i = 0; i < locations.length; i++) {

        let packet = { address: locations[i].address, confidence: 1, limit: 1, id: locations[i].id, name: locations[i].name };

        const y = await getZipCord(packet);

        if (geolib.isPointWithinRadius(origin, y, 5000) == true) {
            eligibleLocations.push([packet.id, y, packet.name, packet.address]);
        }
        ordered = geolib.orderByDistance({ origin }, eligibleLocations);
    }
    return ordered;
}

exports.getZipCord = getZipCord;
exports.getTCenters = getTCenters;
exports.getWithinRadius = getWithinRadius;