// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to Fetch Rides from Firestore
async function fetchRides() {
    const ridesCollection = collection(db, "rides");
    try {
        const querySnapshot = await getDocs(ridesCollection);
        if (querySnapshot.empty) {
            console.log("No rides found. Adding default rides...");
            await addDefaultRides();
        } else {
            displayRides(querySnapshot);
        }
    } catch (error) {
        console.error("Error fetching rides:", error);
    }
}

// Function to Add Default Rides if "rides" Collection is Empty
async function addDefaultRides() {
    const ridesCollection = collection(db, "rides");

    const ridesData = [
        { name: "Aquaman: Power Wave", minHeight: 48, duration: 80, wheelchair: true, serviceAnimal: false, pregnant: false },
        { name: "Batman The Ride", minHeight: 54, duration: 135, wheelchair: true, serviceAnimal: false, pregnant: false },
        { name: "Superman: Tower of Power", minHeight: 52, duration: 120, wheelchair: true, serviceAnimal: false, pregnant: false }
    ];

    try {
        for (let ride of ridesData) {
            await addDoc(ridesCollection, ride);
            console.log(`Added: ${ride.name}`);
        }
        console.log("Default rides added! Refreshing...");
        fetchRides();  // Re-fetch rides after adding
    } catch (error) {
        console.error("Error adding rides: ", error);
    }
}

// Function to Display Rides in the HTML
function displayRides(querySnapshot) {
    const ridesContainer = document.querySelector('.rides-container');
    ridesContainer.innerHTML = ""; // Clear existing rides

    querySnapshot.forEach((doc) => {
        const ride = doc.data();

        const rideElement = document.createElement('div');
        rideElement.classList.add('ride-container');
        rideElement.setAttribute("data-name", ride.name);
        rideElement.setAttribute("data-minHeight", ride.minHeight);
        rideElement.setAttribute("data-duration", ride.duration);
        rideElement.setAttribute("data-wheelchair", ride.wheelchair);
        rideElement.setAttribute("data-serviceAnimal", ride.serviceAnimal);
        rideElement.setAttribute("data-pregnant", ride.pregnant);

        rideElement.innerHTML = `
            <img src="rideImages/${ride.name.replace(/ /g, '')}.jpg" alt="Ride Image" class="ride-container-image">
            <div class="ride-container-text">
                <h2>${ride.name}</h2>
                <p><u>Minimum height</u>: ${ride.minHeight}"</p>
                <p><u>Duration</u>: ${ride.duration} sec</p>
                <p><b>Accessibility Constraints:</b> ${ride.wheelchair ? "Wheelchair Accessible" : ""}
                    ${ride.serviceAnimal ? ", Service Animal Allowed" : ""}
                    ${ride.pregnant ? ", Safe for Pregnant People" : ""}
                </p>
                <div class="button-container">
                    <a href="mapNav.html" class="directions-button">Directions</a>
                </div>
            </div>
        `;

        ridesContainer.appendChild(rideElement);
    });
}

// Run on Page Load
document.addEventListener('DOMContentLoaded', fetchRides);
