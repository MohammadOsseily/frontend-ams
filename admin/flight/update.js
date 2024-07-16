const urlParams = new URLSearchParams(window.location.search);
const flightId = urlParams.get('id');

// Fetch airports and populate the dropdowns
function populateAirports() {
    axios.get('http://localhost/backend-ams/api/airport/read.php')
        .then(response => {
            if (response.data && response.data.airports) {
                const airports = response.data.airports;
                const departureSelect = document.getElementById('departure_airport');
                const arrivalSelect = document.getElementById('arrival_airport');
                
                airports.forEach(airport => {
                    const option = document.createElement('option');
                    option.value = airport.id;
                    option.text = airport.name;
                    departureSelect.add(option.cloneNode(true));
                    arrivalSelect.add(option);
                });
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the airports!', error);
        });
}

// Fetch flight details and populate the form
function fetchFlightDetails() {
    axios.get(`http://localhost/backend-ams/api/flight/read-one.php?id=${flightId}`)
        .then(response => {
            if (response.data && response.data.data) {
                const flight = response.data.data;
                document.getElementById('flight_id').value = flight.id;
                document.getElementById('flight_number').value = flight.flight_number;
                document.getElementById('departure_airport').value = flight.departure_airport_id;
                document.getElementById('arrival_airport').value = flight.arrival_airport_id;
                document.getElementById('departure_time').value = flight.departure_time.replace(' ', 'T');
                document.getElementById('arrival_time').value = flight.arrival_time.replace(' ', 'T');
                document.getElementById('capacity').value = flight.capacity;
                document.getElementById('price').value = flight.price;
            } else {
                console.error('No flight found in response', response.data);
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the flight!', error);
        });
}

document.getElementById('update-flight-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const flightId = document.getElementById('flight_id').value;
    const flightNumber = document.getElementById('flight_number').value;
    const departureAirportId = document.getElementById('departure_airport').value;
    const arrivalAirportId = document.getElementById('arrival_airport').value;
    const departureTime = document.getElementById('departure_time').value.replace('T', ' ');
    const arrivalTime = document.getElementById('arrival_time').value.replace('T', ' ');
    const capacity = document.getElementById('capacity').value;
    const price = document.getElementById('price').value;

    // Frontend validation
    if (departureAirportId === arrivalAirportId) {
        alert("Departure and arrival airports cannot be the same");
        return;
    }

    if (new Date(departureTime) >= new Date(arrivalTime)) {
        alert("Departure time must be before arrival time");
        return;
    }

    if (new Date(departureTime) < new Date()) {
        alert("Departure time must be in the future");
        return;
    }  

    // Validate flight number format (alphanumeric and length between 1 and 10)
    if (!flightNumber.match(/^[a-zA-Z0-9]{1,10}$/)) {
        alert("Flight number should be alphanumeric and up to 10 characters");
        return;
    }

    // Validate capacity (positive integer)
    if (parseInt(capacity) < 1) {
        alert("Capacity must be a positive integer");
        return;
    }

    // Validate price (positive float)
    if (parseFloat(price) < 1) {
        alert("Price must be a positive number");
        return;
    }

    // Prepare data for update
    const flightData = {
        id: flightId,
        flight_number: flightNumber,
        departure_airport: departureAirportId,
        arrival_airport: arrivalAirportId,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        capacity: parseInt(capacity), // Ensure capacity is parsed to integer if necessary
        price: parseFloat(price) // Ensure price is parsed to float if necessary
    };

    // Send update request
    axios.post('http://localhost/backend-ams/api/flight/update.php', flightData)
        .then(response => {
            if (response.data.status === 'success') {
                alert('Flight updated successfully!');
                window.location.href = 'read.html'; // Redirect to flight list after update
            } else {
                alert('Failed to update flight. ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error updating the flight!', error);
            alert('Failed to update flight. Please try again later.');
        });
});

// Populate airports and fetch flight details on page load
populateAirports();
fetchFlightDetails();
