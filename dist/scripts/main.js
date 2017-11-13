// VARS
let map;
let markers = ko.observableArray([]);
const CLIENT_ID = '4DKV23J31PTRWEMCJUER3YAE3R4IU5LDZ0X3112KJI50JFRL';
const CLIENT_SECRET = 'EYAVLRDXWHU22DCQEHHJCWGSFHGRX5TW3MKEP4DNJTPN00HR';
const apiURL = `https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20160118`;
let locations = [{
    lat: 30.08143,
    lng: 31.3434445
}, {
    lat: 30.0916028,
    lng: 31.3187227
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
    var info = location.info.response.venues[0];
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    location.name = info.name;
    location.marker = marker;
    location.marker.addListener('click', function () {
        // CLOSE OTHER WINDOWS
        locations.forEach((loc) => {
            loc.infoWindow.close();
        });
        location.infoWindow.open(map, this);
        location.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            location.marker.setAnimation(null);
        }, 2090);
    });
    // ADD CLICK EVENT
    location.infoWindow = new google.maps.InfoWindow({
        content: `
            ${info.name ? '<p>Name: '+info.name+'</p>' : ''}
            ${info.categories[0].name ? '<p>Category: '+info.categories[0].name+'</p>' : ''}
            ${info.location.country ? '<p>Country: '+info.location.country+'</p>' : ''}
            ${info.location.state ? '<p>State: '+info.location.state+'</p>' : ''}
        `
    });
    location.menuLinkAction = function () {
        google.maps.event.trigger(location.marker, 'click');
    };
    markers.push(location);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers().length; i++) {
        markers()[i].marker.setMap(map);
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
        if (location.name) {
            addMarker(location);
        } else {
            callApi(location);
        }
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
        // FILTER BY LOCATION NAME
        var newlocations = locations.filter(function (location) {
            // VARS
            let query = self.query().toLowerCase();
            let result = (location.name.toLowerCase().search(query) >= 0);
            if (result) {
                addMarker(location);
            }
            return result;
        });
        // UPDATE THE MENU
        markers(newlocations);
    });
    // MARKERS
    this.markers = markers;
    // TOGGLE MENU
    this.TabClass = ko.observable(false);
    this.menuToggleBtn = function(){
        this.TabClass(!this.TabClass());
    };
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

// GET LOCATION DETAILS
function callApi(location) {
    $.ajax({
        url: apiURL,
        data: {
            ll: `${location.lat},${location.lng}`
        }
    }).done(function (data) {
        // VARS
        location.info = data;
        addMarker(location);
    }).fail(function () {
        alert("There is an error with the Foursquare API call.");
    })
}

// error handler
function googleApi() {
    alert("Google Maps API has failed to load.");
}