// VARS
let markers = [{
    lat: 30.1061532,
    lng: 31.3309798
},{
    lat: 30.105927,
    lng: 31.3229273
},{
    lat: 30.0925206,
    lng: 31.3247189
},{
    lat: 30.0925265,
    lng: 31.3338122
},{
    lat: 30.0906328,
    lng: 31.3332114
}];
// GOOGLE MAPS API CALLBACK
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15
    });
    var bounds = new google.maps.LatLngBounds();
    markers.forEach(function(mark) {
        var marker = new google.maps.Marker({
            position: mark,
            map: map
        });
        bounds.extend(marker.getPosition());
    }, this);

    map.fitBounds(bounds);
}