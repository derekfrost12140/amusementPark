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
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
  
    /*********************************
     * 2. Default Rides Data
     *    (Used for seeding if empty)
     *********************************/
    const defaultRidesData = [
      // ... All your ride objects exactly as you have them ...
    ];
  
    async function seedRidesIfEmpty() {
      const snapshot = await db.collection("rides").get();
      if (snapshot.empty) {
        console.log("No rides found in Firestore. Seeding default data...");
        for (const ride of defaultRidesData) {
          await db.collection("rides").add(ride);
        }
        console.log("Seeding complete.");
      } else {
        console.log("Rides collection is not empty. Skipping seeding.");
      }
    }
  
    await seedRidesIfEmpty();
  
    /*********************************
     * 3. Dynamically Load Rides
     *********************************/
    const ridesContainer = document.querySelector('.rides-container');
  
    // (Optional) If you want real-time updates, use onSnapshot:
    // db.collection("rides").onSnapshot((snapshot) => {
    //   ridesContainer.innerHTML = ""; // Clear existing
    //   snapshot.forEach(doc => createRideElement(doc.data()));
    // });
  
    // Otherwise, do a one-time load:
    await db.collection("rides").get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          createRideElement(doc.data());
        });
      })
      .catch(err => console.error("Error loading rides:", err));
  
    // Helper to create each ride's DOM
    function createRideElement(ride) {
      const rideContainer = document.createElement('div');
      rideContainer.classList.add('ride-container', 'bg-green-900');
  
      // Set data attributes for filter & sort
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
  
      rideContainer.innerHTML = `
        <img src="${ride.imageUrl}" alt="Ride Image" class="ride-container-image rounded-xl">
        <div class="ride-container-text">
          <h2>${ride.name}</h2>
          <p>${ride.description}</p>
          <p><u>Minimum height</u>: ${ride.minHeight}"</p>
          <p><u>Duration</u>: ${formatDuration(ride.duration)}</p>
          <p><b>Accessibility Constraints: </b><span class="accessibility-data"></span></p>
          <div class="button-container bg-green-950 text-white hover:scale-125 hover:bg-amber-950 rounded-2xl">
            <a href="mapNav.html?lat=${ride.lat}&lng=${ride.lng}" class="directions-button">Directions</a>
          </div>
        </div>
      `;
  
      // Insert accessibility tags
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
    }
  
    // Example: Convert seconds to "min sec" format
    function formatDuration(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m} min ${s} sec`;
    }
  
    /*********************************
     * 4. Filter Modal Logic
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
        <!-- Sliders & numbers for touch, taste, sound, smell, sight -->
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
     * 5. Sort Modal Logic
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
      // const sortDesc = document.getElementById('sortDesc').checked; // not strictly needed if you use sortAsc
  
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
     * 6. Tag Click -> Toggle Filter
     *********************************/
    document.addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('filter-tag')) {
        const filterType = event.target.getAttribute('data-filter');
        const filterValue = event.target.getAttribute('data-number');
  
        const filterElement =
          document.getElementById(`${filterType}Checkbox`) ||
          document.getElementById(`${filterType}Num`);
  
        if (filterElement && filterElement.type === 'checkbox') {
          filterElement.checked = !filterElement.checked;
        } else if (filterElement && filterElement.type === 'number') {
          filterElement.value = filterValue;
          document.getElementById(`${filterType}Slide`).value = filterValue;
        }
        applyFilters();
      }
    });
  });
  