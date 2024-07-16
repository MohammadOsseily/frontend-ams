
axios.get('http://localhost/backend-ams/api/airport/read.php')
    .then(response => {
        const airports = response.data.airports;
        const departureAirportSelect = document.getElementById('departure_airport');
        const arrivalAirportSelect = document.getElementById('arrival_airport');

        airports.forEach(airport => {
            const option = document.createElement('option');
            option.value = airport.id;
            option.text = airport.name;
            departureAirportSelect.add(option.cloneNode(true));
            arrivalAirportSelect.add(option.cloneNode(true));
        });

        // Enable the submit button after populating airports
        document.getElementById('submit-btn').disabled = false;
    })
    .catch(error => {
        console.error('Failed to fetch airports:', error);
        alert('Failed to fetch airports. Please try again later.');
    });

// Handle form submission
document.getElementById('create-flight-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const flightNumber = document.getElementById('flight_number').value;
    const departureAirport = document.getElementById('departure_airport').value;
    const arrivalAirport = document.getElementById('arrival_airport').value;
    const departureTime = document.getElementById('departure_time').value;
    const arrivalTime = document.getElementById('arrival_time').value;
    const capacity = document.getElementById('capacity').value;
    const price = document.getElementById('price').value;

    if (departureAirport === arrivalAirport) {
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

    // Construct payload as JSON
    const payload = {
        flight_number: flightNumber,
        departure_airport: departureAirport,
        arrival_airport: arrivalAirport,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        capacity: parseInt(capacity),
        price: parseFloat(price)
    };

    axios.post('http://localhost/backend-ams/api/flight/create.php', payload)
    .then(response => {
        if (response.data.status === 'success') {
            alert('Flight created successfully!');
            window.location.href = 'read.html'; 
        } else {
            alert('Failed to create flight. ' + response.data.message);
        }
    })
    .catch(error => {
        console.error('There was an error creating the flight!', error);
        alert('Failed to create flight. Please try again later.');
    });
});