// VARS
let markers = [{
    'name':'1',
    'lat': 30.1061532,
    'lng': 31.3309798
}, {
    'name':'s',
    'lat': 30.105927,
    'lng': 31.3229273
}, {
    'name':'d',
    'lat': 30.0925206,
    'lng': 31.3247189
}, {
    'name':'f',
    'lat': 30.0925265,
    'lng': 31.3338122
}, {
    'name':'g',
    'lat': 30.0906328,
    'lng': 31.3332114
}];

// GOOGLE MAPS API CALLBACK
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
    });
    var bounds = new google.maps.LatLngBounds();
    markers.forEach(function (mark) {
        var marker = new google.maps.Marker({
            position: mark,
            map: map
        });
        bounds.extend(marker.getPosition());
    }, this);

    map.fitBounds(bounds);
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    // FOR SEARCH
    this.query = ko.observable();
    this.query.subscribe(function () {

    });
    // MARKERS
    this.markers = ko.observableArray(markers);
}

// Menu toggle btn
$('#menuToggleBtn').click(function () {
    $('.menu-holder').toggleClass('open');
});

// Activates knockout.js
ko.applyBindings(new AppViewModel());