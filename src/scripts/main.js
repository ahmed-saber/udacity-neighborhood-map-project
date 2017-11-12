// VARS
let map;
let markers = ko.observableArray([]);
const CLIENT_ID = '4DKV23J31PTRWEMCJUER3YAE3R4IU5LDZ0X3112KJI50JFRL';
const CLIENT_SECRET = 'EYAVLRDXWHU22DCQEHHJCWGSFHGRX5TW3MKEP4DNJTPN00HR';
const apiURL = `https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20160118`;
let locations = [{
    lat: 30.1061532,
    lng: 31.3309798
}, {
    lat: 30.105927,
    lng: 31.3229273
}, {
    lat: 30.0925206,
    lng: 31.3247189
}, {
    lat: 30.0925265,
    lng: 31.3338122
}, {
    lat: 30.0906328,
    lng: 31.3332114
}];

// Adds a marker to the map and push to the array.
function addMarker(location) {
    return $.ajax({
        url: apiURL,
        data: {
            ll: `${location.lat},${location.lng}`
        },
        success: function (data) {
            // VARS
            var info = data.response.venues[0];
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            location.name = info.name;
            location.marker = marker;
            // ADD CLICK EVENT
            location.menuLinkAction = function () {
                
            };
            markers.push(location);
        }
    });
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].marker.setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// function to update the markers and list view
function updateLists(locations) {
    // VARS
    var bounds = new google.maps.LatLngBounds();
    // LOOP ON MARKERS
    locations.forEach(function (location) {
        addMarker(location);
        bounds.extend(location);
    }, this);
    // ZOOM ON MARKERS ONLY
    map.fitBounds(bounds);
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    // VARS
    let self = this;
    // SEARCH
    this.query = ko.observable();
    this.query.subscribe(function () {
        // CLEAR MARKERS
        clearMarkers();
    });
    // MARKERS
    this.markers = markers;
}

// GOOGLE MAPS API CALLBACK
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
    });
    // UPDATE THE LIST
    updateLists(locations);
    // Activates knockout.js
    ko.applyBindings(new AppViewModel());
}

// Menu toggle btn
$('#menuToggleBtn').click(function () {
    $('.menu-holder').toggleClass('open');
});