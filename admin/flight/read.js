document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        
        console.log( "no token")
        window.location.href = '/user/auth/login.html';
        
    } else {
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);

        if (decodedToken.data.role !== 'admin') {
            
            console.log( "not admin")
            console.log(decodedToken)
            window.location.href = '/user/auth/login.html';
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', () => {
        
        localStorage.setItem('jwtToken', '');
        location.reload();
        
    });
});
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
