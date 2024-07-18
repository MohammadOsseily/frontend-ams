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
        Swal.fire('Error', 'Failed to fetch airports. Please try again later.', 'error');
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
        Swal.fire('Validation Error', 'Departure and arrival airports cannot be the same', 'error');
        return;
    }

    if (new Date(departureTime) >= new Date(arrivalTime)) {
        Swal.fire('Validation Error', 'Departure time must be before arrival time', 'error');
        return;
    }

    if (new Date(departureTime) < new Date()) {
        Swal.fire('Validation Error', 'Departure time must be in the future', 'error');
        return;
    }    

    // Validate flight number format (alphanumeric and length between 1 and 10)
    if (!flightNumber.match(/^[a-zA-Z0-9]{1,10}$/)) {
        Swal.fire('Validation Error', 'Flight number should be alphanumeric and up to 10 characters', 'error');
        return;
    }

    // Validate capacity (positive integer)
    if (parseInt(capacity) < 1) {
        Swal.fire('Validation Error', 'Capacity must be a positive integer', 'error');
        return;
    }

    // Validate price (positive float)
    if (parseFloat(price) < 1) {
        Swal.fire('Validation Error', 'Price must be a positive number', 'error');
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
            Swal.fire('Success', 'Flight created successfully!', 'success').then(() => {
                window.location.href = 'read.html'; 
            });
        } else {
            Swal.fire('Error', 'Failed to create flight. ' + response.data.message, 'error');
        }
    })
    .catch(error => {
        console.error('There was an error creating the flight!', error);
        Swal.fire('Error', 'Failed to create flight. Please try again later.', 'error');
    });
});
