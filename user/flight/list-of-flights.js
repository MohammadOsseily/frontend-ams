
axios.get('http://localhost/backend-ams/api/flight/read.php')
    .then(response => {
        console.log(response.data); // Log the response to check its structure

        if (response.data && response.data.flights) {
            const flights = response.data.flights;
            const flightsList = document.getElementById('flights-list');
            flightsList.innerHTML = ''; // Clear previous content

            flights.forEach(flight => {

                const flightDiv = document.createElement('div');
                flightDiv.innerHTML = `
                    <a href="single-flight.html?id=${flight.flight_id}">
                        Flight Number: ${flight.flight_number || 'No Flight Number'} - 
                        Departure: ${flight.departure_time || 'No Departure Time'} from ${flight.departure_airport_id || 'No Departure Airport'} to ${flight.arrival_airport_id || 'No Arrival Airport'} - 
                        Arrival: ${flight.arrival_time || 'No Arrival Time'}
                    </a>
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