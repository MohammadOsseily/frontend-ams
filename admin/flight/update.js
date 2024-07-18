const urlParams = new URLSearchParams(window.location.search);
const flightId = urlParams.get('id');

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
            Swal.fire('Error', 'Failed to fetch airports. Please try again later.', 'error');
        });
}

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
                Swal.fire('Error', 'No flight found.', 'error');
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the flight!', error);
            Swal.fire('Error', 'Failed to retrieve flight details. Please try again later.', 'error');
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
        Swal.fire('Error', "Departure and arrival airports cannot be the same", 'error');
        return;
    }

    if (new Date(departureTime) >= new Date(arrivalTime)) {
        Swal.fire('Error', "Departure time must be before arrival time", 'error');
        return;
    }

    if (new Date(departureTime) < new Date()) {
        Swal.fire('Error', "Departure time must be in the future", 'error');
        return;
    }  

    // Validate flight number format (alphanumeric and length between 1 and 10)
    if (!flightNumber.match(/^[a-zA-Z0-9]{1,10}$/)) {
        Swal.fire('Error', "Flight number should be alphanumeric and up to 10 characters", 'error');
        return;
    }

    // Validate capacity (positive integer)
    if (parseInt(capacity) < 1) {
        Swal.fire('Error', "Capacity must be a positive integer", 'error');
        return;
    }

    // Validate price (positive float)
    if (parseFloat(price) < 1) {
        Swal.fire('Error', "Price must be a positive number", 'error');
        return;
    }

    const flightData = {
        id: flightId,
        flight_number: flightNumber,
        departure_airport: departureAirportId,
        arrival_airport: arrivalAirportId,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        capacity: parseInt(capacity), 
        price: parseFloat(price)
    };

    axios.post('http://localhost/backend-ams/api/flight/update.php', flightData)
        .then(response => {
            if (response.data.status === 'success') {
                Swal.fire('Success', 'Flight updated successfully!', 'success')
                    .then(() => {
                        window.location.href = 'read.html';
                    });
            } else {
                Swal.fire('Error', 'Failed to update flight. ' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('There was an error updating the flight!', error);
            Swal.fire('Error', 'Failed to update flight. Please try again later.', 'error');
        });
});

populateAirports();
fetchFlightDetails();
