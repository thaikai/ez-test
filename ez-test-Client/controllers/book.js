$(function () {

    $(".get-locations-button").click(function () {
        var url = 'http://localhost:8000/api/appointments/';
        url = url + getZipField();
        console.log(url);
        QueryData(url);
    });

    function getZipField() {
        var z = $('#zipcode-field').val();
        return z;
    };
    
    $(document.body).on('click', '.appointment-slot', function(){

        // ROOT for find() in .test-center-card
        const root = $(this).closest('.test-center-card');
        var address = root.find('.test-center-address').text();     // test center name
        var name = root.find('.test-center-name').text();        // test center address
        var locationId = root.find('.test-center-id').text();       // test center id

        // get tab pane ID
        var id = '#' + $(this).closest('.tab-pane').attr('id');
        // get list item targeting tab pane, extract txt date
        var date = $('.nav-tab-link-wrapper').find('li').filter('[data-target="'+id+'"]').text();
        // get time from this.text()
        var time = reformatTime($(this).text());
        // combine data + time for db eligible dateTime
        var dateTime = date + ' ' + time;

        // find location id
        var li = $('.nav-tab-link-wrapper').find('li').filter('[data-target="'+id+'"]');
        var location = li.closest('ul').attr('id');

        console.log("ID  : " + id);
        console.log("Date: " + date);
        console.log("Time: " + time);
        console.log(dateTime);
        console.log("Location: " + location);

        $('#modal-detail-location-name').text(name);
        $('#modal-detail-location-address').text(address);
        $('#modal-detail-date-time').text(dateTime);

        // hidden inputs used to book appointment
        $("input[name='dateTime']").val(dateTime);
        $("input[name='testCenterID']").val(locationId);

    });
})

// Queries data from URL
function QueryData(url) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function ReceivedCallback() {
        if (this.readyState === 4 && this.status === 200) {

            let results = JSON.parse(this.responseText);

            if (results.length === 0) {
                console.log("results length == 0");
            } else {
                // show location appts
                showLocations(results);
            }
        } else {
            // no result found
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function showLocations(results) {

    console.log(results);

    // accordion
    var accordion = '<dl class="accordion">'

    // FOR EACH LOCATION
    for (var i = 0; i < results.length; i++) {

        var cardSkeletonStart = '<div class="test-center-card">';

        // CREATE NAV
        var cardTop = '<dt>'
            +           '<div>'
            +               '<p class="test-center-name">' + results[i].name + '</p>'
            +               '<p class="test-center-address">' + results[i].address + '</p>'
            +               '<p class="test-center-id" style="display: none">' + results[i].id + '</p>'
            +           '</div>'
            +           '<button type="button" class="view-appointments-button">'+'+ VIEW APPOINTMENTS'+'</button>'
            +         '</dt>';
        
        var cardBottom = '<dd style="display: none">'
            +               '<ul class="nav-tab-link-wrapper" id='+results[i].id+'>'
            +                   '<li class="nav-tab-link" data-toggle="tab" data-target="#tab-'+i+'-0">' + oneDayBack(results[i].appointments[1][1][1]) + '</li>'
            +                   '<li class="nav-tab-link" data-toggle="tab" data-target="#tab-'+i+'-1">' + getDate(results[i].appointments[1][1][1]) + '</li>'
            +                   '<li class="nav-tab-link" data-toggle="tab" data-target="#tab-'+i+'-2">' + getDate(results[i].appointments[2][1][1]) + '</li>'
            +                   '<li class="nav-tab-link" data-toggle="tab" data-target="#tab-'+i+'-3">' + getDate(results[i].appointments[3][1][1]) + '</li>'
            +                   '<li class="nav-tab-link" data-toggle="tab" data-target="#tab-'+i+'-4">' + getDate(results[i].appointments[4][1][1]) + '</li>'
            +                   '<li class="nav-tab-link" data-toggle="tab" data-target="#tab-'+i+'-5">' + getDate(results[i].appointments[5][1][1]) + '</li>'
            +                   '<li class="nav-tab-link" data-toggle="tab" data-target="#tab-'+i+'-6">' + getDate(results[i].appointments[6][1][1]) + '</li>'
            +               '</ul>';
                
        var tabs = '<div class="tab-content">';

        // for each day
        for (var j = 0; j < results[i].appointments.length; j++){

            var tabSkeleton = '';
            if(j == 0){
                tabSkeleton = '<div id="tab-'+i+'-'+j+'" class="tab-pane fade in active">';
            } else {
                tabSkeleton = '<div id="tab-'+i+'-'+j+'" class="tab-pane fade">';
            }

            tabSkeleton = tabSkeleton.concat('<div class="appointments-grid">');

            // each slot in each day
            if(results[i].appointments[j][1] != false){
                for (var y = 0; y < results[i].appointments[j][1].length; y++){
                    tabSkeleton = tabSkeleton.concat('<button class="appointment-slot" data-toggle="modal" data-target="#myModal">'+getTime(results[i].appointments[j][1][y])+'</button>');
                }
            }

            tabSkeleton = tabSkeleton.concat('</div>');
            tabSkeleton = tabSkeleton.concat('</div>');

            tabs = tabs.concat(tabSkeleton);

        }

        tabs = tabs.concat('</div>');
        tabs = tabs.concat('</dd>');

    
        var cardSkeletonEnd = '</div>';

        var card1 = cardSkeletonStart.concat(cardTop);
        var card2 = card1.concat(cardBottom);
        var card3 = card2.concat(tabs);
        var card4 = card3.concat(cardSkeletonEnd);
        
        console.log(card4);

        accordion = accordion.concat(card4);

    }

    accordion.concat('</dl>');
    $('.div-block-58').append(accordion);

}

function getDate(date){
    const { DateTime } = luxon;
    const value = DateTime
        .fromFormat(date, "yyyy-MM-dd HH:mm:ss")
        .toFormat('yyyy-MM-dd');
    return value;
}

function getTime(date){
    const { DateTime } = luxon;
    const value = DateTime
        .fromFormat(date, "yyyy-MM-dd HH:mm:ss")
        .toFormat('h:mm a');
    return value;
}

function reformatTime(time){
    const { DateTime } = luxon;
    const value = DateTime
        .fromFormat(time, "h:mm a")
        .toFormat('HH:mm:ss');
    return value;
}

function oneDayBack(date){
    const { DateTime } = luxon;
    var value = DateTime
        .fromFormat(date, "yyyy-MM-dd HH:mm:ss")
        .minus({days: 1})
        .toFormat('yyyy-MM-dd');
    return value;
}
