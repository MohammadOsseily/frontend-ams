let flights = [];

axios.get('http://localhost/backend-ams/api/flight/read.php')
    .then(response => {
        console.log(response.data); // Log the response to check its structure

        if (response.data && response.data.flights) {
            flights = response.data.flights;
            displayFlights(flights);
        } else {
            console.error('No flights found in response', response.data);
        }
    })
    .catch(error => {
        console.error('There was an error retrieving the flights!', error);
    });

function displayFlights(flights) {
    const flightsList = document.getElementById('flights-list');
    flightsList.innerHTML = ''; // Clear previous content

    flights.forEach(flight => {
        const flightDiv = document.createElement('div');
        flightDiv.innerHTML = `
            <a href="single-flight.html?id=${flight.id}">
                Flight Number: ${flight.flight_number || 'No Flight Number'} - 
                Departure: ${flight.departure_time || 'No Departure Time'} from ${flight.departure_airport_name || 'No Departure Airport'} to ${flight.arrival_airport_name || 'No Arrival Airport'} - 
                Arrival: ${flight.arrival_time || 'No Arrival Time'}
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
