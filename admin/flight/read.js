function fetchFlights() {
    axios.get('http://localhost/backend-ams/api/flight/read.php')
        .then(response => {
            if (response.data && response.data.flights) {
                const flights = response.data.flights;
                const flightsList = document.getElementById('flights-list');
                flightsList.innerHTML = ''; 

                flights.forEach(flight => {
                    const flightDiv = document.createElement('div');
                    flightDiv.classList.add('flight-item');
                    flightDiv.innerHTML = `
                        <a href="../../user/flight/single-flight.html?id=${flight.id}">
                            Flight Number: ${flight.flight_number || 'No Flight Number'} - 
                            Departure: ${flight.departure_time || 'No Departure Time'} 
                            Arrival: ${flight.arrival_time || 'No Arrival Time'} - 
                            Available Seats: ${flight.capacity}
                        </a>
                        <div class="admin-actions">
                            <a href="update.html?id=${flight.id}" class="update-link button-link">Update</a>
                            <a href="#" class="delete-link button-link" onclick="deleteFlight(${flight.id})">Delete</a>
                        </div>
                    `;
                    flightsList.appendChild(flightDiv);
                });
            } else {
                console.error('No flights found in response', response.data);
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the flights!', error);
        });
}

// Function to delete a flight
function deleteFlight(flightId) {
    if (confirm('Are you sure you want to delete this flight?')) {
        axios.post('http://localhost/backend-ams/api/flight/delete.php', {
            id: flightId // Ensure this matches the parameter name expected by backend
        })
        .then(response => {
            if (response.data.status === 'success') {
                alert('Flight deleted successfully!');
                fetchFlights(); // Reload flights after deletion
            } else {
                alert('Failed to delete flight. ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error deleting the flight!', error);
            alert('Failed to delete flight. Please try again later.');
        });
    }
}

// Fetch flights on page load
fetchFlights();
