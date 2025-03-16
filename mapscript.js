let map, userMarker, defaultMarker;
let markers = [];
let infoWindow;

// Default location coordinates
const defaultLocation = { lat: 32.7561025211987, lng: -97.07243375722175 };

// Function to show markers by rating
function showMarkersByRating(rating) {
    markers.forEach(marker => {
        marker.setMap(marker.accessRating === rating ? map : null);
    });
}

// Function to show all markers
function showAllMarkers() {
    markers.forEach(marker => marker.setMap(map));
}

// Function to hide all markers
function hideAllMarkers() {
    markers.forEach(marker => marker.setMap(null));
}

// Function to add markers to the map
function addMarker(location, title, accessRating) {
    const marker = new google.maps.Marker({
        position: location,
        map,
        title,
        accessRating,
    });

    markers.push(marker);

    google.maps.event.addListener(marker, "click", () => {
        if (infoWindow) infoWindow.close();
        infoWindow = new google.maps.InfoWindow({ content: title });
        infoWindow.open(map, marker);
    });
}

// Initialize and display the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: defaultLocation,
    });

    defaultMarker = new google.maps.Marker({
        position: defaultLocation,
        map,
        title: "Default Location",
    });

    markers.push(defaultMarker);

    // Adding predefined markers
    addMarker({ lat: 32.75694774660049, lng: -97.06858634954958 }, "Aquaman", "A");
    addMarker({ lat: 32.75867956518985, lng: -97.0665944558818 }, "Batman", "B");
    // Add additional markers here...

    trackUserLocation();
}

// Track user location
function trackUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            updateUserLocation,
            showError,
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Update user location on the map
function updateUserLocation(position) {
    const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    };

    if (!userMarker) {
        userMarker = new google.maps.Marker({
            position: userLocation,
            map,
            title: "My Location",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        markers.push(userMarker);
    } else {
        userMarker.setPosition(userLocation);
    }
}

// Handle geolocation errors
function showError(error) {
    const errors = {
        1: "Permission denied. Please enable location tracking.",
        2: "Position unavailable.",
        3: "Request timeout.",
    };
    alert(errors[error.code] || "An unknown error occurred.");
}
