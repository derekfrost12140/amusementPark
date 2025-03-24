import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, setDoc, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Define styles as a string
const styles = `
.rides-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Max 3 columns */
    gap: 20px;
    padding: 20px;
    justify-content: center;
}

/* Card Styling */
.ride-container {
    background-color: #f1f1f1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out, height 0.3s ease-in-out;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 250px; /* Default height */
}

.ride-container:hover {
    transform: scale(1.05);
}

/* Expanded state */
.ride-container.expanded {
    height: auto;
}

/* Image Container */
.image-container {
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.ride-container-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Ride Name */
.ride-name {
    font-size: 1.2em;
    font-weight: bold;
    color: black;
    text-align: center;
  
}

/* Ride Details */
.ride-details {
    width: 100%;
    padding: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    text-align: center;
    display: none;
}

.ride-container.expanded .ride-details {
    display: block;
}

/* Favorite Button */
.directions-button, .favorite-button {
  background-color: white; /* White background */
  color: black; /* Black text */
  border: 1px solid black; /* Thin black border */
  border-radius: 20px; /* More rounded corners */
  padding: 8px 16px; /* Keep a compact size */
  font-size: 16px; /* Slightly larger text */
  transition: background 0.3s, transform 0.3s, color 0.3s;
  margin: 5px; /* Adds space between buttons */
}

.directions-button:hover, .favorite-button:hover {
  background-color: #f2f2f2; /* Light gray hover effect */
  transform: scale(1.05); /* Scale up to 110% */
}





/* Remove Favorite */
.remove-favorite {
    background-color: red;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 10px;
    text-align: center;
    width: 100%
}

.remove-favorite:hover {
    background-color: darkred;
}
`;


// Inject styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Sample ride data
const rides = [
    { name: "Thunder Mountain", image: "ride1.jpg" },
    { name: "Splash Canyon", image: "ride2.jpg" },
    { name: "Space Rocket", image: "ride3.jpg" },
    { name: "Wild River", image: "ride4.jpg" },
    { name: "Sky Coaster", image: "ride5.jpg" },
    { name: "Haunted Mansion", image: "ride6.jpg" }
];

const rideContainer = document.getElementById("rideContainer");

// Function to create and add ride cards
function createRideCard(ride) {
    const card = document.createElement("div");
    card.classList.add("ride-card");

    card.innerHTML = `
        <div class="ride-name">${ride.name}</div>
        <img src="${ride.image}" alt="${ride.name}">
        <div class="ride-details">
            <p>Experience the thrill of ${ride.name}!</p>
            <button class="favorite-button">Add to Favorites</button>
        </div>
    `;

    card.querySelector(".favorite-button").addEventListener("click", () => addToFavorites(ride, card));

    return card;
}

// Function to add rides to the main container
function loadRides() {
    rides.forEach(ride => {
        rideContainer.appendChild(createRideCard(ride));
    });
}

// Favorites functionality
const favoriteContainer = document.getElementById("favorite-rides");

function addToFavorites(ride, card) {
    if (!favoriteContainer) return;

    const favoriteCard = card.cloneNode(true);
    favoriteCard.querySelector(".favorite-button").remove(); // Remove the "Add to Favorites" button

    // Add "Remove" button
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-favorite");
    removeBtn.innerText = "Remove from Favorites";
    removeBtn.addEventListener("click", () => favoriteCard.remove());

    favoriteCard.appendChild(removeBtn);
    favoriteContainer.appendChild(favoriteCard);
}

// Load rides when page loads
window.onload = loadRides;




document.addEventListener('DOMContentLoaded', async () => {
  /*********************************
   * 1. Initialize Firebase
   *********************************/
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
  const app = initializeApp(firebaseConfig); // Correct way to initialize Firebase
  const auth = getAuth(app); // Get Auth instance
  const db = getFirestore(app); // Get Firestore instance

  console.log(app ? "✅ Firebase initialized successfully" : "❌ Firebase NOT initialized");
  console.log(db ? "✅ Firestore initialized" : "❌ Firestore NOT initialized");
  
    /*********************************
     * 2. Default Rides Data
     *    (Used for seeding if empty)
     *********************************/
    const defaultRidesData = [
      {
        name: "AQUAMAN: Power Wave",
        description: "Experience the powerful force of this aquatic attraction as you’re pulled back and forth, mimicking the mighty waves of the ocean.",
        imageUrl: "rideImages/Aquaman.png",
        lat: 32.75694774660049,
        lng: -97.06858634954958,
        minHeight: 48,
        duration: 80,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 4,
        taste: 1,
        sound: 4,
        smell: 1,
        sight: 3
      },
      {
        name: "BATMAN The Ride",
        description: "See what it’s like behind the mask on this 50-mph juggernaut as you star in your own GOTHAM adventure.",
        imageUrl: "rideImages/Batman.jpg",
        lat: 32.75867956518985,
        lng: -97.0665944558818,
        minHeight: 54,
        duration: 135,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 8,
        taste: 1,
        sound: 7,
        smell: 1,
        sight: 8
      },
      {
        name: "BATWING",
        description: "Here’s a ride fit for brave young batboys and batgirls, perfect for toddlers and young children seeking adventure.",
        imageUrl: "rideImages/Batwing.png",
        lat: 32.757562316535875,
        lng: -97.067054891455,
        minHeight: 48,
        duration: 105,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 2,
        smell: 1,
        sight: 3
      },
      {
        name: "Boomtown Depot",
        description: "Climb aboard our classic train for a scenic cruise around the park. Enjoy the novelty of traveling by authentic steam engine.",
        imageUrl: "rideImages/BoomtownDepot.jpg",
        lat: 32.75775980664769,
        lng: -97.06749839143542,
        minHeight: 0,
        duration: 480,
        wheelchair: true,
        serviceAnimal: true,
        pregnant: true,
        touch: 2,
        taste: 1,
        sound: 3,
        smell: 1,
        sight: 3
      },
      {
        name: "Boot Scootin'",
        description: "No spurs or lasso required for this gently ‘bucking’ ride, perfect for young riders. Enjoy the west without too much 'wild.'",
        imageUrl: "rideImages/BootScootin.jpg",
        lat: 32.757154197253314,
        lng: -97.0720959368577,
        minHeight: 36,
        duration: 105,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 3,
        smell: 1,
        sight: 3
      },
      {
        name: "Bugs Bunny Cloud Bouncer",
        description: "Soar to new heights with this gentle beginner drop tower ride for young thrill-seekers, offering soft, cushioned drops.",
        imageUrl: "rideImages/BugsBunnyCloud.jpg",
        lat: 32.75637875518429,
        lng: -97.06841704130149,
        minHeight: 42,
        duration: 60,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 3,
        smell: 1,
        sight: 3
      },
      {
        name: "CATWOMAN Whip",
        description: "Hold onto the whip’s handle as this GOTHAM ride spins you around at heights up to 68 feet, swirling and twirling unpredictably!",
        imageUrl: "rideImages/Catwoman.jpg",
        lat: 32.75726920754156,
        lng: -97.06628719155061,
        minHeight: 48,
        duration: 240,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 7,
        taste: 1,
        sound: 7,
        smell: 1,
        sight: 7
      },
      {
        name: "Cloud Bouncer",
        description: "Hop into a hot air balloon and circle above Goodtimes Square. Spin the center disk to control how fast you twirl!",
        imageUrl: "rideImages/CloudBouncer.jpg",
        lat: 32.75687916891457,
        lng: -97.06778361202024,
        minHeight: 42,
        duration: 120,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 2,
        smell: 1,
        sight: 3
      },
      {
        name: "Daffy Duck Bucket Blasters",
        description: "Spin round and round in water barrels equipped with water guns! Splash each other and nearby guests in this wacky water battle.",
        imageUrl: "rideImages/BucketBlasters.jpg",
        lat: 32.75912726546584,
        lng: -97.06800230384427,
        minHeight: 48,
        duration: 100,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 5,
        taste: 2,
        sound: 4,
        smell: 2,
        sight: 4
      },
      {
        name: "El Diablo",
        description: "A super loop coaster that throws you around for six full 180s at a breathtaking speed. Face-to-face seating adds extra thrills!",
        imageUrl: "rideImages/ElDiablo.png",
        lat: 32.755825529397704,
        lng: -97.07200652921023,
        minHeight: 48,
        duration: 90,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 7,
        taste: 1,
        sound: 7,
        smell: 1,
        sight: 7
      },
      {
        name: "El Sombrero",
        description: "Hang on to your hats! This giant spinning sombrero tilts and whips riders in a carousel-style swirl. Viva la fiesta!",
        imageUrl: "rideImages/Sombrero.png",
        lat: 32.755489433620255,
        lng: -97.0709131848416,
        minHeight: 42,
        duration: 60,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 4,
        smell: 1,
        sight: 2
      },
      {
        name: "Gunslinger",
        description: "Holster yourself into a bucket seat and dangle as the ride spins, flinging you outward the faster it goes. Yee-haw!",
        imageUrl: "rideImages/Gunslinger.jpg",
        lat: 32.75323847916851,
        lng: -97.06802371184325,
        minHeight: 42,
        duration: 100,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 5,
        taste: 1,
        sound: 5,
        smell: 1,
        sight: 5
      },
      {
        name: "JUSTICE LEAGUE: Battle for METROPOLIS",
        description: "Fight THE JOKER and LEX LUTHOR with a laser gun in this immersive 4D ride to save the JUSTICE LEAGUE!",
        imageUrl: "rideImages/JusticeLeague.jpg",
        lat: 32.757991473958874,
        lng: -97.0677503492011,
        minHeight: 48,
        duration: 240,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 5,
        taste: 1,
        sound: 5,
        smell: 1,
        sight: 6
      },
      {
        name: "La Fiesta de las Tazas",
        description: "Spin inside giant teacups that are spinning on top of something else spinning—triple spinning madness for the whole family!",
        imageUrl: "rideImages/TeaCups.png",
        lat: 32.75731315275531,
        lng: -97.06689389616429,
        minHeight: 42,
        duration: 90,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 2,
        smell: 1,
        sight: 3
      },
      {
        name: "La Vibora",
        description: "Bobsled-style coaster that slithers like a snake, with winding track that slides you up the walls around each twist!",
        imageUrl: "rideImages/Vibora.jpg",
        lat: 32.755669332272035,
        lng: -97.07129106781014,
        minHeight: 42,
        duration: 100,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 7,
        taste: 1,
        sound: 6,
        smell: 1,
        sight: 6
      },
      {
        name: "Mr. Freeze",
        description: "Launch from 0-70 mph in 3.8 seconds, fly up a 236-foot tower, then do it all in reverse! Beware the cold!",
        imageUrl: "rideImages/Freeze.png",
        lat: 32.75548781011889,
        lng: -97.07155711109925,
        minHeight: 54,
        duration: 90,
        wheelchair: false,
        serviceAnimal: false,
        pregnant: false,
        touch: 8,
        taste: 1,
        sound: 8,
        smell: 1,
        sight: 8
      },
      {
        name: "Oil Derrick",
        description: "Ascend 300+ feet in this observation tower for an expansive bird’s eye view of the entire park and skyline!",
        imageUrl: "rideImages/OilDerrick.png",
        lat: 32.75784178390764,
        lng: -97.06661224784125,
        minHeight: 0,
        duration: 90,
        wheelchair: true,
        serviceAnimal: true,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 3,
        smell: 1,
        sight: 3
      },
      {
        name: "Silver Star Carousel",
        description: "Iconic vintage carousel with over 60 horses. A beautiful, nostalgic ride right near the front gate!",
        imageUrl: "rideImages/SilverStar.jpg",
        lat: 32.758886637131965,
        lng: -97.07057433567623,
        minHeight: 42,
        duration: 210,
        wheelchair: true,
        serviceAnimal: true,
        pregnant: false,
        touch: 3,
        taste: 1,
        sound: 2,
        smell: 1,
        sight: 3
      },
      {
        name: "SUPERMAN: Tower of Power",
        description: "Rocket up 325 feet, then plunge multiple 10+ story drops. Experience extreme G-forces in free-fall!",
        imageUrl: "rideImages/Superman.png",
        lat: 32.758384840744206,
        lng: -97.06868454595156,
        minHeight: 52,
        duration: 120,
        wheelchair: true,
        serviceAnimal: true,
        pregnant: false,
        touch: 8,
        taste: 1,
        sound: 7,
        smell: 1,
        sight: 7
      },
      {
        name: "Texas Depot",
        description: "Board the Sam Houston steam engine for a pleasant and scenic tour around the park. All aboard!",
        imageUrl: "rideImages/TexasDepot.jpg",
        lat: 32.7570749439281,
        lng: -97.07255299151078,
        minHeight: 0,
        duration: 480,
        wheelchair: true,
        serviceAnimal: true,
        pregnant: true,
        touch: 2,
        taste: 1,
        sound: 3,
        smell: 1,
        sight: 3
      },
      {
        name: "Texas SkyScreamer",
        description: "Like a giant swing ride, but 400 feet in the air! Spin high above the park for a thrilling view.",
        imageUrl: "rideImages/SkyScreamer.png",
        lat: 32.75676784036096,
        lng: -97.0658927520594,
        minHeight: 48,
        duration: 165,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 7,
        taste: 1,
        sound: 5,
        smell: 1,
        sight: 6
      },
      {
        name: "THE RIDDLER Revenge",
        description: "A giant swinging pendulum ride that spins and swoops at up to 70 mph, disorienting you in multiple axes!",
        imageUrl: "rideImages/Riddler.png",
        lat: 32.75685106292408,
        lng: -97.0652765520594,
        minHeight: 52,
        duration: 180,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 8,
        taste: 1,
        sound: 8,
        smell: 1,
        sight: 8
      },
      {
        name: "Titan",
        description: "One of the tallest and longest coasters in the park. 245 feet tall, 85 mph, 3.5-minute ride full of G-forces!",
        imageUrl: "rideImages/Titan.jpg",
        lat: 32.7557677102804,
        lng: -97.07418512037097,
        minHeight: 48,
        duration: 200,
        wheelchair: true,
        serviceAnimal: false,
        pregnant: false,
        touch: 8,
        taste: 1,
        sound: 7,
        smell: 1,
        sight: 7
      }
    ];
  
    /*********************************
     * 3. Seed Firestore if Empty
     *********************************/
    async function seedRidesIfEmpty() {
      const ridesCollectionRef = collection(db, "rides");
      const snapshot = await getDocs(ridesCollectionRef); 
      
      if (snapshot.empty) {
        console.log("No rides found in Firestore. Seeding default data...");
        for (const ride of defaultRidesData) {
          await addDoc(ridesCollectionRef, ride);
        }
        console.log("Seeding complete.");
      } else {
        console.log("Rides collection is not empty. Skipping seeding.");
      }
    }
  
/*********************************/

    const ridesContainer = document.querySelector('.rides-container');
  
    // Or do a one-time load:
    const ridesCollectionRef = collection(db, "rides");
    const querySnapshot = await getDocs(ridesCollectionRef); // Use getDocs instead of db.collection("rides").get()
    
    querySnapshot.forEach(doc => {
      createRideElement(doc.data()); // Create ride elements from Firestore data
    });

    function createRideElement(ride) {
      const rideContainer = document.createElement('div');
      rideContainer.classList.add('ride-container');
  
      // Set ride attributes for filtering
      rideContainer.setAttribute('data-wheelchair', ride.wheelchair);
      rideContainer.setAttribute('data-serviceAnimal', ride.serviceAnimal);
      rideContainer.setAttribute('data-pregnant', ride.pregnant);
      rideContainer.setAttribute('data-touch', ride.touch);
      rideContainer.setAttribute('data-taste', ride.taste);
      rideContainer.setAttribute('data-sound', ride.sound);
      rideContainer.setAttribute('data-smell', ride.smell);
      rideContainer.setAttribute('data-sight', ride.sight);
      rideContainer.setAttribute('data-name', ride.name);
      rideContainer.setAttribute('data-minHeight', ride.minHeight);
      rideContainer.setAttribute('data-duration', ride.duration);
  
      // Format duration
      function formatDuration(seconds) {
          const m = Math.floor(seconds / 60);
          const s = seconds % 60;
          return `${m} min ${s} sec`;
      }
  
      // Ride card HTML structure
      rideContainer.innerHTML = `
          <div class="image-container">
              <img src="${ride.imageUrl || 'default-image.jpg'}" alt="${ride.name}" class="ride-container-image">
          </div>
          <h2 class="ride-name">${ride.name}</h2>
          <div class="ride-details">
              <p><b>Description: </b>${ride.description || "No description available."}</p>
              <p><b>Min Height: </b>${ride.minHeight || "N/A"}"</p>
              <p><b>Duration: </b>${formatDuration(ride.duration) || "N/A"}</p>
              <p><b>Accessibility Constraints: </b><span class="accessibility-data text-sm"></span></p>
              <div class="flex justify-between items-center gap-2 mt-3">
                <a href="mapNav.html?lat=${ride.lat}&lng=${ride.lng}" class="directions-button w-1/2 text-center py-1">Directions</a>
                <button class="favorite-button w-1/2 py-1" data-ride-id="${ride.id}" data-ride-name="${ride.name}">
                  ☆ Favorite
                </button>
              </div>

      `;
      
      const accessibilityData = rideContainer.querySelector('.accessibility-data');
      let accText = [];
      if (ride.wheelchair) {
        accText.push("<span class='filter-tag' data-filter='wheelchair'>Wheelchair Accessible</span>");
      }
      if (ride.serviceAnimal) {
        accText.push("<span class='filter-tag' data-filter='serviceAnimal'>Service Animal Allowed</span>");
      }
      if (ride.pregnant) {
        accText.push("<span class='filter-tag' data-filter='pregnant'>Accessible to Pregnant People</span>");
      }
      accText.push(`<span class='filter-tag' data-filter='touch' data-number='${ride.touch}'>Touch Level: ${ride.touch}</span>`);
      accText.push(`<span class='filter-tag' data-filter='taste' data-number='${ride.taste}'>Taste Level: ${ride.taste}</span>`);
      accText.push(`<span class='filter-tag' data-filter='sound' data-number='${ride.sound}'>Sound Level: ${ride.sound}</span>`);
      accText.push(`<span class='filter-tag' data-filter='smell' data-number='${ride.smell}'>Smell Level: ${ride.smell}</span>`);
      accText.push(`<span class='filter-tag' data-filter='sight' data-number='${ride.sight}'>Sight Level: ${ride.sight}</span>`);
      accessibilityData.innerHTML = accText.join('');
  
      ridesContainer.appendChild(rideContainer);

      // ✅ Hover event to expand and show details
      rideContainer.addEventListener("click", () => {
          rideContainer.classList.add("expanded");
      });
  
      rideContainer.addEventListener("mouseleave", () => {
          rideContainer.classList.remove("expanded");
      });
  
      
      // Favorite button functionality
      const favoriteButton = rideContainer.querySelector(".favorite-button");
      favoriteButton.addEventListener("click", () => toggleFavorite(ride.name, favoriteButton));
  
      ridesContainer.appendChild(rideContainer);
  }

    function toggleFavorite(rideName, button) {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          alert('You need to be logged in to favorite a ride!');
          return;
        }

        const rideRef = doc(db, `users/${user.uid}/favorites/${rideName}`);

        getDoc(rideRef).then((docSnap) => {
          if (docSnap.exists()) {
            // If it exists, the ride is already a favorite, so remove it
            deleteDoc(rideRef).then(() => {
              button.classList.remove('favorited');
              button.textContent = '☆ Favorite';
              console.log(`Ride ${rideName} removed from favorites`);
            }).catch((error) => console.error("Error removing favorite: ", error));
          } else {
            // If it doesn't exist, the ride is not a favorite, so add it
            setDoc(rideRef, {
              id: rideName,
              name: button.getAttribute('data-ride-name')
            }).then(() => {
              button.classList.add('favorited');
              button.textContent = '★ Favorited';
              console.log(`Ride ${rideName} added to favorites`);
            }).catch((error) => console.error("Error adding favorite: ", error));
          }
        }).catch((error) => console.error("Error checking favorite: ", error));
      });
    }

    // Adding event listener to favorite buttons dynamically
      ridesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('favorite-button')) {
          const rideId = e.target.getAttribute('data-ride-id');
          const rideName = e.target.getAttribute('data-ride-name');
          toggleFavorite(rideName, e.target);  // Call the function to toggle the favorite
        }
      });

  
    /*********************************
     * 5. Filter Modal
     *********************************/
    const filterBtn = document.getElementById('filterBtn');
    const preferencesModal = document.createElement('div');
    preferencesModal.classList.add('preferences-modal');
    preferencesModal.innerHTML = `
      <div class="preferences-modal-content">
        <h2>Filter Preferences</h2>
        <label><input type="checkbox" id="wheelchairCheckbox"> Wheelchair Accessible</label><br>
        <label><input type="checkbox" id="serviceAnimalCheckbox"> Service Animal Friendly</label><br>
        <label><input type="checkbox" id="pregnant"> Accessible to Pregnant People</label><br>
        <label>
          <form>
            <input type="range" id="touchSlide" min="0" max="10" value="10" oninput="this.form.touchNum.value=this.value">
            <input type="number" id="touchNum" min="0" max="10" value="10" oninput="this.form.touchSlide.value=this.value"> Touch
          </form>
        </label><br>
        <label>
          <form>
            <input type="range" id="tasteSlide" min="0" max="10" value="10" oninput="this.form.tasteNum.value=this.value">
            <input type="number" id="tasteNum" min="0" max="10" value="10" oninput="this.form.tasteSlide.value=this.value"> Taste
          </form>
        </label><br>
        <label>
          <form>
            <input type="range" id="soundSlide" min="0" max="10" value="10" oninput="this.form.soundNum.value=this.value">
            <input type="number" id="soundNum" min="0" max="10" value="10" oninput="this.form.soundSlide.value=this.value"> Sound
          </form>
        </label><br>
        <label>
          <form>
            <input type="range" id="smellSlide" min="0" max="10" value="10" oninput="this.form.smellNum.value=this.value">
            <input type="number" id="smellNum" min="0" max="10" value="10" oninput="this.form.smellSlide.value=this.value"> Smell
          </form>
        </label><br>
        <label>
          <form>
            <input type="range" id="sightSlide" min="0" max="10" value="10" oninput="this.form.sightNum.value=this.value">
            <input type="number" id="sightNum" min="0" max="10" value="10" oninput="this.form.sightSlide.value=this.value"> Sight
          </form>
        </label><br>
        <button id="applyFiltersBtn">Apply Filters</button>
        <button id="closeModalBtn">Close</button>
      </div>
    `;
    document.body.appendChild(preferencesModal);
  
    let previousFilterState = {};
  
    filterBtn.addEventListener('click', () => {
      preferencesModal.style.display = 'flex';
      previousFilterState = {
        wheelchair: document.getElementById('wheelchairCheckbox').checked,
        serviceAnimal: document.getElementById('serviceAnimalCheckbox').checked,
        pregnant: document.getElementById('pregnant').checked,
        touch: document.getElementById('touchSlide').value,
        taste: document.getElementById('tasteSlide').value,
        sound: document.getElementById('soundSlide').value,
        smell: document.getElementById('smellSlide').value,
        sight: document.getElementById('sightSlide').value
      };
    });
  
    document.getElementById('closeModalBtn').addEventListener('click', () => {
      // revert to previous
      document.getElementById('wheelchairCheckbox').checked = previousFilterState.wheelchair;
      document.getElementById('serviceAnimalCheckbox').checked = previousFilterState.serviceAnimal;
      document.getElementById('pregnant').checked = previousFilterState.pregnant;
      document.getElementById('touchSlide').value = previousFilterState.touch;
      document.getElementById('tasteSlide').value = previousFilterState.taste;
      document.getElementById('soundSlide').value = previousFilterState.sound;
      document.getElementById('smellSlide').value = previousFilterState.smell;
      document.getElementById('sightSlide').value = previousFilterState.sight;
      preferencesModal.style.display = 'none';
      applyFilters();
    });
  
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
      applyFilters();
      preferencesModal.style.display = 'none';
    });
  
    function applyFilters() {
      const wheelchairChecked = document.getElementById('wheelchairCheckbox').checked;
      const serviceAnimalChecked = document.getElementById('serviceAnimalCheckbox').checked;
      const pregnantChecked = document.getElementById('pregnant').checked;
      const touchVal = parseInt(document.getElementById('touchSlide').value, 10);
      const tasteVal = parseInt(document.getElementById('tasteSlide').value, 10);
      const soundVal = parseInt(document.getElementById('soundSlide').value, 10);
      const smellVal = parseInt(document.getElementById('smellSlide').value, 10);
      const sightVal = parseInt(document.getElementById('sightSlide').value, 10);
  
      const rideContainers = document.querySelectorAll('.ride-container');
      rideContainers.forEach(ride => {
        const hasWheelchair = (ride.getAttribute('data-wheelchair') === 'true');
        const hasServiceAnimal = (ride.getAttribute('data-serviceAnimal') === 'true');
        const hasPregnant = (ride.getAttribute('data-pregnant') === 'true');
        const touchData = parseInt(ride.getAttribute('data-touch'), 10);
        const tasteData = parseInt(ride.getAttribute('data-taste'), 10);
        const soundData = parseInt(ride.getAttribute('data-sound'), 10);
        const smellData = parseInt(ride.getAttribute('data-smell'), 10);
        const sightData = parseInt(ride.getAttribute('data-sight'), 10);
  
        const matchesFilter =
          (!wheelchairChecked || hasWheelchair) &&
          (!serviceAnimalChecked || hasServiceAnimal) &&
          (!pregnantChecked || hasPregnant) &&
          (touchData <= touchVal) &&
          (tasteData <= tasteVal) &&
          (soundData <= soundVal) &&
          (smellData <= smellVal) &&
          (sightData <= sightVal);
  
        ride.style.display = matchesFilter ? 'flex' : 'none';
      });
    }
  
    /*********************************
     * 6. Sort Modal
     *********************************/
    const sortBtn = document.getElementById('sortBtn');
    const sortModal = document.createElement('div');
    sortModal.classList.add('sort-modal');
    sortModal.innerHTML = `
      <div class="sort-modal-content">
        <h2>Sort Preferences</h2>
        <div class="sort-options">
          <label><input type="radio" name="sortOption" id="sortByName" checked> Sort by Name</label><br>
          <label><input type="radio" name="sortOption" id="sortByHeight"> Sort by Minimum Height</label><br>
          <label><input type="radio" name="sortOption" id="sortByDuration"> Sort by Duration</label><br>
        </div>
        <div class="sort-order">
          <label><input type="radio" name="sortOrder" id="sortAsc" checked> Ascending (A-Z)</label><br>
          <label><input type="radio" name="sortOrder" id="sortDesc"> Descending (Z-A)</label><br>
        </div>
        <button id="applySortBtn">Apply Sort</button>
        <button id="closeSortModalBtn">Close</button>
      </div>
    `;
    document.body.appendChild(sortModal);
  
    sortBtn.addEventListener('click', () => {
      sortModal.style.display = 'flex';
    });
    document.getElementById('closeSortModalBtn').addEventListener('click', () => {
      sortModal.style.display = 'none';
    });
  
    document.getElementById('applySortBtn').addEventListener('click', () => {
      const sortByName = document.getElementById('sortByName').checked;
      const sortByHeight = document.getElementById('sortByHeight').checked;
      const sortByDuration = document.getElementById('sortByDuration').checked;
      const sortAsc = document.getElementById('sortAsc').checked;
      // If needed, you can read sortDesc from document.getElementById('sortDesc').checked
  
      const rideContainers = Array.from(document.querySelectorAll('.ride-container'));
      const sortOrder = sortAsc ? 1 : -1;
  
      if (sortByName) {
        rideContainers.sort((a, b) => {
          const nameA = a.querySelector('h2').textContent.toLowerCase();
          const nameB = b.querySelector('h2').textContent.toLowerCase();
          return nameA.localeCompare(nameB) * sortOrder;
        });
      } else if (sortByHeight) {
        rideContainers.sort((a, b) => {
          const heightA = parseInt(a.getAttribute('data-minHeight'), 10);
          const heightB = parseInt(b.getAttribute('data-minHeight'), 10);
          return (heightA - heightB) * sortOrder;
        });
      } else if (sortByDuration) {
        rideContainers.sort((a, b) => {
          const durationA = parseInt(a.getAttribute('data-duration'), 10);
          const durationB = parseInt(b.getAttribute('data-duration'), 10);
          return (durationA - durationB) * sortOrder;
        });
      }
  
      // Re-append in sorted order
      rideContainers.forEach(ride => ridesContainer.appendChild(ride));
      sortModal.style.display = 'none';
    });

    /*********************************
     * 8. Tag Click -> Modal Similar Rides
     *********************************/
    // Create the modal element
    const filterModal = document.createElement('div');
    filterModal.classList.add('filter-modal');
    filterModal.style.display = 'none'; // Ensure the modal is hidden on page load
    

    // Create the modal content container
    const modalContent = document.createElement('div');
    modalContent.classList.add('filter-modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    // Add the modal title
    const modalTitle = document.createElement('h2');
    modalTitle.classList.add('text-2xl', 'font-semibold', 'text-center', 'text-white');
    modalTitle.textContent = 'Similar Rides';

    // Create a container for the filtered ride list
    const modalRideList = document.createElement('div');
    modalRideList.id = 'modalRideList';

    // Add the close button
    const closeBtn = document.createElement('button');
    closeBtn.id = 'closeFilterModalBtn';
    closeBtn.id = 'closeFilterModalBtn';
    closeBtn.textContent = 'Close';
    closeBtn.style.position = 'absolute'; // Position it absolutely within the modal
    closeBtn.style.top = '10px'; // Adjust top distance
    closeBtn.style.right = '10px'; // Adjust right distance
    closeBtn.style.zIndex = '9999'; // Make sure it's on top of other content

    // Append the modal close button and title
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalRideList);
    // Append the modal content to the modal container
    filterModal.appendChild(modalContent);

    // Append the modal to the body
    document.body.appendChild(filterModal);

    // Function to show filtered rides in the modal
    function showFilteredRides(filter, filterValue) {
      const rides = document.querySelectorAll('.ride-container');
      const filteredRides = [];

      if (typeof filterValue == 'string') {
        const filterName = filter[0].toUpperCase() + filter.slice(1);
        modalTitle.textContent = `Rides with ${filterName} Level \u2264 ${filterValue}`
      }
      else if (filter == 'wheelchair') {
        modalTitle.textContent = `Rides Wheelchair Accessible`
        console.log(typeof filterValue)
      }
      else if (filter == 'serviceAnimal') {
        modalTitle.textContent = `Rides Allowing Service Animals`
        console.log(typeof filterValue)
      }
      else if (filter == 'pregnant') {
        modalTitle.textContent = `Rides Suitable for Pregnant People`
        console.log(typeof filterValue)
      }
      else{
        modalTitle.textContent = `Rides with ${filter}`
      }
      

      rides.forEach(ride => {
        const rideFilterValue = ride.getAttribute(`data-${filter}`);
        
        // Check if the filter is a boolean or a numerical value
        if (filter === 'wheelchair' || filter === 'serviceAnimal' || filter === 'pregnant') {
          if (rideFilterValue === 'true') {
            filteredRides.push(ride);
          }
        } else {
          if (parseInt(rideFilterValue, 10) <= parseInt(filterValue, 10)) {
            filteredRides.push(ride);
          }
        }
      });

      // Sort filtered rides alphabetically by name
      filteredRides.sort((a, b) => {
        const nameA = a.querySelector('h2').textContent.toLowerCase();
        const nameB = b.querySelector('h2').textContent.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      // Clear previous ride list in the modal
      modalRideList.innerHTML = '';

      // Append each filtered ride to the modal
      filteredRides.forEach(ride => {
        const rideName = ride.querySelector('h2').textContent;
        const rideImage = ride.querySelector('img').src;
        const rideDescription = ride.querySelector('p').textContent;

        const rideDetails = document.createElement('div');
        rideDetails.classList.add('ride-modal-detail');
        rideDetails.innerHTML = `
          <div class="ride-modal-image-container" >
            <img src="${rideImage}" alt="Ride Image">
          </div>
          <div class="ride-modal-text">
            <h3>${rideName}</h3>
            <p>${rideDescription}</p>
          </div>
        `;
        modalRideList.appendChild(rideDetails);
      });

      // Display the modal
      filterModal.style.display = 'flex';
    }

    // Close the modal when the "Close" button is clicked
    closeBtn.addEventListener('click', () => {
      filterModal.style.display = 'none';
    });

    // Open the modal when a filter tag is clicked
    document.addEventListener('click', function(event) {
      if (event.target && event.target.classList.contains('filter-tag')) {
        const filter = event.target.getAttribute('data-filter');
        const filterValue = event.target.getAttribute('data-number');
        showFilteredRides(filter, filterValue);
      }
    });
  });
  