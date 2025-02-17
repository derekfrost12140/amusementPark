document.addEventListener('DOMContentLoaded', () => {
    // Handle the filter button click event
    const filterBtn = document.getElementById('filterBtn');
    const preferencesModal = document.createElement('div'); // Create the modal dynamically

    preferencesModal.classList.add('preferences-modal');
    preferencesModal.innerHTML = `
        <div class="preferences-modal-content">
            <h2>Filter Preferences</h2>
            <label>
                <input type="checkbox" id="wheelchairCheckbox"> Wheelchair Accessible
            </label><br>
            <label>
                <input type="checkbox" id="serviceAnimalCheckbox"> Service Animal Friendly
            </label><br>
            <label>
                <input type="checkbox" id="pregnant"> Accessible to Pregnant People
            </label><br>
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
    let previousFilterState = {};

    // Append modal to body
    document.body.appendChild(preferencesModal);

    // Show the modal when filter button is clicked
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

    // Close the modal when the "Close" button is clicked
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('wheelchairCheckbox').checked = previousFilterState.wheelchair;
        document.getElementById('serviceAnimalCheckbox').checked = previousFilterState.serviceAnimal;
        document.getElementById('pregnant').checked = previousFilterState.pregnant;
        document.getElementById('touchSlide').value = previousFilterState.touch;
        document.getElementById('tasteSlide').value = previousFilterState.taste;
        document.getElementById('soundSlide').value = previousFilterState.sound;
        document.getElementById('smellSlide').value = previousFilterState.smell;
        document.getElementById('sightSlide').value = previousFilterState.sight;

        // Close the modal
        preferencesModal.style.display = 'none';

        // Reapply the filters with the previous state
        applyFilters();
    });

    // Handle the filter logic when Apply Filters is clicked
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        const wheelchairChecked = document.getElementById('wheelchairCheckbox').checked;
        const serviceAnimalChecked = document.getElementById('serviceAnimalCheckbox').checked;
        const pregnantChecked = document.getElementById('pregnant').checked;
        const touchVal = document.getElementById('touchSlide').value;
        const tasteVal = document.getElementById('tasteSlide').value;
        const soundVal = document.getElementById('soundSlide').value;
        const smellVal = document.getElementById('smellSlide').value;
        const sightVal = document.getElementById('sightSlide').value;

        console.log('Wheelchair:', wheelchairChecked);
        console.log('Service Animal:', serviceAnimalChecked);
        console.log('Pregnant:', pregnantChecked);

        // Get all the ride containers
        const rideContainers = document.querySelectorAll('.ride-container');

        // Loop through each ride and check if it matches the selected preferences
        rideContainers.forEach(ride => {
            // Extract data attributes from the ride container
            const hasWheelchair = ride.getAttribute('data-wheelchair') === 'true';
            const hasServiceAnimal = ride.getAttribute('data-serviceAnimal') === 'true';
            const hasPregnant = ride.getAttribute('data-pregnant') === 'true';
            const touchData = parseInt(ride.getAttribute('data-touch'), 10);
            const tasteData = parseInt(ride.getAttribute('data-taste'), 10);
            const soundData = parseInt(ride.getAttribute('data-sound'), 10);
            const smellData = parseInt(ride.getAttribute('data-smell'), 10);
            const sightData = parseInt(ride.getAttribute('data-sight'), 10);

            // Check if the ride matches the selected filters
            const matchesFilter = 
                (!wheelchairChecked || hasWheelchair) &&
                (!serviceAnimalChecked || hasServiceAnimal) &&
                (!pregnantChecked || hasPregnant) &&
                (parseInt(touchData, 10) <= parseInt(touchVal, 10)) &&
                (parseInt(tasteData, 10) <= parseInt(tasteVal, 10)) &&
                (parseInt(soundData, 10) <= parseInt(soundVal, 10)) &&
                (parseInt(smellData, 10) <= parseInt(smellVal, 10)) &&
                (parseInt(sightData, 10) <= parseInt(sightVal, 10));

            // Show or hide the ride container based on the match
            if (matchesFilter) {
                ride.style.display = 'flex';  // Show the ride
            } else {
                ride.style.display = 'none';  // Hide the ride
            }
        });

        // Close the modal after applying the filter
        preferencesModal.style.display = 'none';
    });

    // Loop through each ride container and extract accessibility data
    const rideContainers = document.querySelectorAll('.ride-container');
    rideContainers.forEach((ride) => {
        // Grab the data-* attributes
        const wheelchair = ride.getAttribute('data-wheelchair');
        const serviceAnimal = ride.getAttribute('data-serviceAnimal');
        const pregnant = ride.getAttribute('data-pregnant');
        const touch = ride.getAttribute('data-touch');
        const taste = ride.getAttribute('data-taste');
        const sound = ride.getAttribute('data-sound');
        const smell = ride.getAttribute('data-smell');
        const sight = ride.getAttribute('data-sight');

        // Find the span where the accessibility data will be injected
        const accessibilityData = ride.querySelector('.accessibility-data');
        
        // Create an array to hold the accessibility features
        let accessibilityText = [];

        // Check each attribute and add the appropriate text
        if (wheelchair === 'true') {
            accessibilityText.push("<span class='filter-tag' data-filter='wheelchair'>Wheelchair Accessible</span>");
        }
        if (serviceAnimal === 'true') {
            accessibilityText.push("<span class='filter-tag' data-filter='serviceAnimal'>Service Animal Allowed</span>");
        }
        if (pregnant === 'true') {
            accessibilityText.push("<span class='filter-tag' data-filter='pregnant'>Accessible to Pregnant People</span>");
        }
        accessibilityText.push(`<span class='filter-tag' data-filter='touch' data-number='${touch}'> Touch Level: ` +touch+ `</span>`); //TODO: add the val (touch) to the span
        accessibilityText.push(`<span class='filter-tag' data-filter='taste' data-number='${taste}'> Taste Level: ` +taste+ `</span>`);
        accessibilityText.push(`<span class='filter-tag' data-filter='sound' data-number='${sound}'> Sound Level: ` +sound+ `</span>`);
        accessibilityText.push(`<span class='filter-tag' data-filter='smell' data-number='${smell}'> Smell Level: ` +smell+ `</span>`);
        accessibilityText.push(`<span class='filter-tag' data-filter='sight' data-number='${sight}'> Sight Level: ` +sight+ `</span>`);
        // Join the text array into a single string and insert it into the span
        accessibilityData.innerHTML = accessibilityText.join('') || "No accessibility information available";
    });

    // Handle the sort button click event
    const sortBtn = document.getElementById('sortBtn');
    const sortModal = document.createElement('div'); // Create the modal dynamically
    sortModal.classList.add('sort-modal');
    sortModal.innerHTML = `
        <div class="sort-modal-content">
            <h2>Sort Preferences</h2>
            <div class="sort-options">
                <label>
                    <input type="radio" name="sortOption" id="sortByName" checked> Sort by Name
                </label><br>
                <label>
                    <input type="radio" name="sortOption" id="sortByHeight"> Sort by Minimum Height
                </label><br>
                <label>
                    <input type="radio" name="sortOption" id="sortByDuration"> Sort by Duration
                </label><br>
            </div>
            <div class="sort-order">
                <label>
                    <input type="radio" name="sortOrder" id="sortAsc" checked> Ascending (A-Z)
                </label><br>
                <label>
                    <input type="radio" name="sortOrder" id="sortDesc"> Descending (Z-A)
                </label><br>
            </div>
            <button id="applySortBtn">Apply Sort</button>
            <button id="closeSortModalBtn">Close</button>
        </div>
    `;
    document.body.appendChild(sortModal);

    // Show the modal when sort button is clicked
    sortBtn.addEventListener('click', () => {
        sortModal.style.display = 'flex';
    });

    // Close the modal when the "Close" button is clicked
    document.getElementById('closeSortModalBtn').addEventListener('click', () => {
        sortModal.style.display = 'none';
    });

    // Handle the sort logic when Apply Sort is clicked
    document.getElementById('applySortBtn').addEventListener('click', () => {
        const sortByName = document.getElementById('sortByName').checked;
        const sortByHeight = document.getElementById('sortByHeight').checked;
        const sortByDuration = document.getElementById('sortByDuration').checked;
        const sortAsc = document.getElementById('sortAsc').checked;  // Ascending order
        const sortDesc = document.getElementById('sortDesc').checked; // Descending order

        const rideArray = Array.from(rideContainers);
        let sortOrder = sortAsc ? 1 : -1; // 1 for ascending, -1 for descending

        if (sortByName) {
            rideArray.sort((a, b) => {
                const nameA = a.querySelector('h2').textContent.toLowerCase();
                const nameB = b.querySelector('h2').textContent.toLowerCase();
                return nameA.localeCompare(nameB) * sortOrder;  // Apply sort order
            });
        } else if (sortByHeight) {
            rideArray.sort((a, b) => {
                const heightA = parseInt(a.getAttribute('data-minHeight'));
                const heightB = parseInt(b.getAttribute('data-minHeight'));
                return (heightA - heightB) * sortOrder;  // Apply sort order
            });
        } else if (sortByDuration) {
            rideArray.sort((a, b) => {
                const durationA = parseInt(a.getAttribute('data-duration'));
                const durationB = parseInt(b.getAttribute('data-duration'));
                return (durationA - durationB) * sortOrder;  // Apply sort order
            });
        }

        // Append the sorted rides back to the container
        const ridesContainer = document.querySelector('.rides-container');
        rideArray.forEach(ride => {
            ridesContainer.appendChild(ride);
        });

        // Close the sort modal
        sortModal.style.display = 'none';
    });
});

document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('filter-tag')) {
        const filterType = event.target.getAttribute('data-filter');
        const filterValue = event.target.getAttribute('data-number');

        console.log(`Tag clicked: ${filterType}, Value: ${filterValue}`);
        // Find the corresponding input element (checkbox or number box)
        const filterElement = document.getElementById(`${filterType}Checkbox`) || document.getElementById(`${filterType}Num`);

        // If the element is a checkbox
        if (filterElement && filterElement.type === 'checkbox') {
            // Toggle checkbox state if it's a checkbox
            filterElement.checked = !filterElement.checked;
        }
        
        // If the element is a number box
        else if (filterElement && filterElement.type === 'number') {
            // Set the number input value to the value inside the filter tag
            filterElement.value = filterValue;
            document.getElementById(`${filterType}Slide`).value = filterValue;
            //FIX: clicking tag does not apply the filter (only to slider options)
        }
        applyFilters();
    }
});

// Apply the filter
function applyFilters() {
    const wheelchairChecked = document.getElementById('wheelchairCheckbox').checked;
    const serviceAnimalChecked = document.getElementById('serviceAnimalCheckbox').checked;
    const pregnantChecked = document.getElementById('pregnant').checked;
    const touchVal = document.getElementById('touchSlide').value;
    const tasteVal = document.getElementById('tasteSlide').value;
    const soundVal = document.getElementById('soundSlide').value;
    const smellVal = document.getElementById('smellSlide').value;
    const sightVal = document.getElementById('sightSlide').value;

    // Get all the ride containers
    const rideContainers = document.querySelectorAll('.ride-container');

    // Loop through each ride and check if it matches the selected preferences
    rideContainers.forEach(ride => {
        // Extract data attributes from the ride container
        const hasWheelchair = ride.getAttribute('data-wheelchair') === 'true';
        const hasServiceAnimal = ride.getAttribute('data-serviceAnimal') === 'true';
        const hasPregnant = ride.getAttribute('data-pregnant') === 'true';
        const touchData = parseInt(ride.getAttribute('data-touch'), 10);
        const tasteData = parseInt(ride.getAttribute('data-taste'), 10);
        const soundData = parseInt(ride.getAttribute('data-sound'), 10);
        const smellData = parseInt(ride.getAttribute('data-smell'), 10);
        const sightData = parseInt(ride.getAttribute('data-sight'), 10);

        // Check if the ride matches the selected filters
        const matchesFilter = 
            (!wheelchairChecked || hasWheelchair) &&
            (!serviceAnimalChecked || hasServiceAnimal) &&
            (!pregnantChecked || hasPregnant) &&
            (parseInt(touchData, 10) <= parseInt(touchVal, 10)) &&
            (parseInt(tasteData, 10) <= parseInt(tasteVal, 10)) &&
            (parseInt(soundData, 10) <= parseInt(soundVal, 10)) &&
            (parseInt(smellData, 10) <= parseInt(smellVal, 10)) &&
            (parseInt(sightData, 10) <= parseInt(sightVal, 10));

        // Show or hide the ride container based on the match
        if (matchesFilter) {
            ride.style.display = 'flex';  // Show the ride
        } else {
            ride.style.display = 'none';  // Hide the ride
        }
    });
}