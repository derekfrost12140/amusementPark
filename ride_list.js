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
                <input type="checkbox" id="pregnant"> Show Rides Accessible to Pregnant People
            </label><br>
            <label>
                <input type="checkbox" id="inaccessibleCheckbox"> Inaccessible Ride
            </label><br>
            <label>
                <input type="checkbox" id="sensoryCheckbox"> Sensory Friendly
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
            inaccessible: document.getElementById('inaccessibleCheckbox').checked,
            sensory: document.getElementById('sensoryCheckbox').checked
        };
    });

    // Close the modal when the "Close" button is clicked
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('wheelchairCheckbox').checked = previousFilterState.wheelchair;
        document.getElementById('serviceAnimalCheckbox').checked = previousFilterState.serviceAnimal;
        document.getElementById('pregnant').checked = previousFilterState.pregnant;
        document.getElementById('inaccessibleCheckbox').checked = previousFilterState.inaccessible;
        document.getElementById('sensoryCheckbox').checked = previousFilterState.sensory;

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
        const inaccessibleChecked = document.getElementById('inaccessibleCheckbox').checked;
        const sensoryChecked = document.getElementById('sensoryCheckbox').checked;

        console.log('Wheelchair:', wheelchairChecked);
        console.log('Service Animal:', serviceAnimalChecked);
        console.log('Short Wait:', pregnantChecked);
        console.log('Inaccessible:', inaccessibleChecked);
        console.log('Sensory:', sensoryChecked);

        // Get all the ride containers
        const rideContainers = document.querySelectorAll('.ride-container');

        // Loop through each ride and check if it matches the selected preferences
        rideContainers.forEach(ride => {
            // Extract data attributes from the ride container
            const hasWheelchair = ride.getAttribute('data-wheelchair') === 'true';
            const hasServiceAnimal = ride.getAttribute('data-serviceAnimal') === 'true';
            const hasPregnant = ride.getAttribute('data-pregnant') === 'true';
            const hasInaccessible = ride.getAttribute('data-inaccessible') === 'true';
            const hasSensory = ride.getAttribute('data-sensory') === 'true';

            // Check if the ride matches the selected filters
            const matchesFilter = 
                (!wheelchairChecked || hasWheelchair) &&
                (!serviceAnimalChecked || hasServiceAnimal) &&
                (!pregnantChecked || hasPregnant) &&
                (!inaccessibleChecked || hasInaccessible) &&
                (!sensoryChecked || hasSensory);

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
        const inaccessible = ride.getAttribute('data-inaccessible');
        const sensory = ride.getAttribute('data-sensory');

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
            accessibilityText.push("<span class='filter-tag' data-filter='pregnant'>Show Rides Accessible to Pregnant People</span>");
        }
        if (inaccessible === 'true') {
            accessibilityText.push("<span class='filter-tag' data-filter='inaccessible'>Inaccessible</span>");
        }
        if (sensory === 'true') {
            accessibilityText.push("<span class='filter-tag' data-filter='sensory'>Sensory Accessible</span>");
        }
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
        const filterCheckbox = document.getElementById(`${filterType}Checkbox`);

        filterCheckbox.checked = !filterCheckbox.checked;

        applyFilters();
    }
});

// Apply the filter
function applyFilters() {
    const wheelchairChecked = document.getElementById('wheelchairCheckbox').checked;
    const serviceAnimalChecked = document.getElementById('serviceAnimalCheckbox').checked;
    const pregnantChecked = document.getElementById('pregnant').checked;
    const inaccessibleChecked = document.getElementById('inaccessibleCheckbox').checked;

    const rideContainers = document.querySelectorAll('.ride-container');
    rideContainers.forEach(ride => {
        const hasWheelchair = ride.getAttribute('data-wheelchair') === 'true';
        const hasServiceAnimal = ride.getAttribute('data-serviceAnimal') === 'true';
        const hasPregnant = ride.getAttribute('data-pregnant') === 'true';
        const hasInaccessible = ride.getAttribute('data-inaccessible') === 'true';

        const matchesFilter =
            (!wheelchairChecked || hasWheelchair) &&
            (!serviceAnimalChecked || hasServiceAnimal) &&
            (!pregnantChecked || hasPregnant) &&
            (!inaccessibleChecked || hasInaccessible) &&
            (!sensoryChecked || hasSensory);

        if (matchesFilter) {
            ride.style.display = 'flex';
        } else {
            ride.style.display = 'none';
        }
    });
}