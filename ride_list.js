// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBn7xE-jaEuixzyDROnbHrQo6-YtOR5LaU",
    authDomain: "amusement-park-4039d.firebaseapp.com",
    projectId: "amusement-park-4039d",
    storageBucket: "amusement-park-4039d.appspot.com",
    messagingSenderId: "625618396056",
    appId: "1:625618396056:web:ff2907be3a1958ed9041ed",
    measurementId: "G-6QHBHT0PPE"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const ridesContainer = document.getElementById('ridesContainer');

// Function to Load Rides from Firestore
function loadRidesFromFirestore() {
    db.collection("locations").get().then((querySnapshot) => {
        ridesContainer.innerHTML = ''; // Clear container
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const rideElement = createRideElement(data);
            ridesContainer.appendChild(rideElement);
        });
    }).catch(error => {
        console.error("Error loading rides: ", error);
    });
}

// Function to Create a Ride Element
function createRideElement(data) {
    const rideDiv = document.createElement('div');
    rideDiv.classList.add('ride-container');
    rideDiv.setAttribute('data-wheelchair', data.wheelchair);
    rideDiv.setAttribute('data-serviceAnimal', data.serviceAnimal);
    rideDiv.setAttribute('data-pregnant', data.pregnant);
    rideDiv.setAttribute('data-touch', data.touch);
    rideDiv.setAttribute('data-taste', data.taste);
    rideDiv.setAttribute('data-sound', data.sound);
    rideDiv.setAttribute('data-smell', data.smell);
    rideDiv.setAttribute('data-sight', data.sight);
    rideDiv.setAttribute('data-name', data.title);
    rideDiv.setAttribute('data-minHeight', data.minHeight);
    rideDiv.setAttribute('data-duration', data.duration);

    rideDiv.innerHTML = `
        <img src="rideImages/${data.image}" alt="${data.title}" class="ride-container-image">
        <div class="ride-container-text">
            <h2>${data.title}</h2>
            <p>${data.description}</p>
            <p><u>Minimum height</u>: ${data.minHeight}"</p>
            <p><u>Duration</u>: ${Math.floor(data.duration / 60)} min ${data.duration % 60} sec</p>
            <p><b>Accessibility Constraints: </b><span class="accessibility-data"></span></p>
            <div class="button-container">
                <a href="mapNav.html?lat=${data.lat}&lng=${data.lng}" class="directions-button">Directions</a> 
            </div>
        </div>
    `;
    return rideDiv;
}

// Function to Populate Firestore with Default Rides (If Empty)
function addDefaultRidesToFirestore() {
    db.collection("locations").get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            const defaultRides = [
                { title: "Aquaman: Power Wave", lat: 32.7569477466, lng: -97.0685863495, category: "A", minHeight: 48, duration: 80, wheelchair: true, serviceAnimal: false, pregnant: false, touch: 4, taste: 1, sound: 4, smell: 1, sight: 3, image: "Aquaman.png", description: "Experience the powerful force of this aquatic attraction as you’re pulled back and forth, mimicking the mighty waves of the ocean." },
                { title: "Batman The Ride", lat: 32.7586795651, lng: -97.0665944558, category: "B", minHeight: 54, duration: 135, wheelchair: true, serviceAnimal: false, pregnant: false, touch: 8, taste: 1, sound: 7, smell: 1, sight: 8, image: "Batman.jpg", description: "See what it’s like behind the mask on this deeply inaccessible, 50-mph juggernaut as you star in your own GOTHAM adventure." },
                { title: "Batwing", lat: 32.7575623165, lng: -97.0670548914, category: "C", minHeight: 48, duration: 105, wheelchair: true, serviceAnimal: false, pregnant: false, touch: 3, taste: 1, sound: 2, smell: 1, sight: 3, image: "Batwing.png", description: "Here’s a ride fit for brave young batboys and batgirls, perfect for toddlers and young children seeking adventure." }
            ];

            defaultRides.forEach(ride => {
                db.collection("locations").add(ride).then(() => {
                    console.log(`Ride "${ride.title}" added successfully.`);
                }).catch(error => {
                    console.error("Error adding ride: ", error);
                });
            });
        }
    }).catch(error => {
        console.error("Error checking Firestore rides: ", error);
    });
}

// Run Firestore Setup and Load Rides on Page Load
document.addEventListener('DOMContentLoaded', () => {
    addDefaultRidesToFirestore();
    loadRidesFromFirestore();
});
