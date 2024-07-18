let flights = [];

axios.get('http://localhost/backend-ams/api/flight/read.php')
    .then(response => {
        if (response.data && response.data.flights) {
            flights = response.data.flights;
            displayFlights(flights);
        } else {
            console.error('No flights found in response', response.data);
            Swal.fire({
                title: 'No Flights Found',
                text: 'There were no flights found in the response.',
                icon: 'info',
                confirmButtonText: 'Okay'
            });
        }
    })
    .catch(error => {
        console.error('There was an error retrieving the flights!', error);
        Swal.fire({
            title: 'Error',
            text: 'There was an error retrieving the flights. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    });

function displayFlights(flights) {
    const flightsList = document.getElementById('flights-list');
    flightsList.innerHTML = ''; 

    flights.forEach(flight => {
        const flightDiv = document.createElement('div');
        flightDiv.classList.add('flight-item');
        flightDiv.innerHTML = `
            <a href="single-flight.html?id=${flight.id}">
                ${flight.flight_number || 'No Flight Number'} - from ${flight.departure_airport_name || 'No Departure Airport'} to ${flight.arrival_airport_name || 'No Arrival Airport'}
            </a>
        `;
        flightsList.appendChild(flightDiv);
    });
}

function filterFlights() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredFlights = flights.filter(flight => 
        (flight.flight_number && flight.flight_number.toLowerCase().includes(searchTerm)) || 
        (flight.departure_airport_name && flight.departure_airport_name.toLowerCase().includes(searchTerm)) || 
        (flight.arrival_airport_name && flight.arrival_airport_name.toLowerCase().includes(searchTerm))
    );
    displayFlights(filteredFlights);
}
