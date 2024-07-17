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
                Swal.fire('Error', 'No flights found.', 'error');
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the flights!', error);
            Swal.fire('Error', 'Failed to retrieve flights. Please try again later.', 'error');
        });
}

// Function to delete a flight
function deleteFlight(flightId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post('http://localhost/backend-ams/api/flight/delete.php', {
                id: flightId 
            })
            .then(response => {
                if (response.data.status === 'success') {
                    Swal.fire('Deleted!', 'Flight deleted successfully.', 'success');
                    fetchFlights(); 
                } else {
                    Swal.fire('Error', 'Failed to delete flight. ' + response.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('There was an error deleting the flight!', error);
                Swal.fire('Error', 'Failed to delete flight. Please try again later.', 'error');
            });
        }
    });
}

fetchFlights();
