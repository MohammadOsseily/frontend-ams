
const urlParams = new URLSearchParams(window.location.search);
const flightId = urlParams.get('id');
const userId = 12; // Hardcoded user ID for now
let departureTime;
let capacity;

function fetchFlightDetails() {
    axios.get(`http://localhost/backend-ams/api/flight/read-one.php?id=${flightId}`)
        .then(response => {
            if (response.data && response.data.data) {
                const flight = response.data.data;
                const flightDetails = document.getElementById('flight-details');
                departureTime = new Date(flight.departure_time);
                capacity = flight.capacity;

                flightDetails.innerHTML = `
                    <p>Flight Number: ${flight.flight_number || 'No Flight Number'}</p>
                    <p>Departure Time: ${flight.departure_time || 'No Departure Time'}</p>
                    <p>Arrival Time: ${flight.arrival_time || 'No Arrival Time'}</p>
                    <p>Departure Airport: ${flight.departure_airport || 'No Departure Airport'}</p>
                    <p>Arrival Airport: ${flight.arrival_airport || 'No Arrival Airport'}</p>
                    <p>Available Seats: ${flight.capacity}</p>
                `;
                checkBookingStatus();
            } else {
                console.error('No flight found in response', response.data);
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the flight!', error);
        });
}

function checkBookingStatus() {
    axios.get(`http://localhost/backend-ams/api/flight_bookings/read-one.php?user_id=${userId}&flight_id=${flightId}`)
        .then(response => {
            const bookingSection = document.getElementById('booking-section');
            if (response.data.status === "success" && response.data.data) {
                document.getElementById('cancel-booking-btn').style.display = 'block';
            } else if (capacity > 0) {
                document.getElementById('book-flight-btn').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('There was an error checking the booking status!', error);
        });
}

function bookFlight() {
    if (new Date() > departureTime) {
        alert('Cannot book a flight that has already departed');
        return;
    }

    if (capacity <= 0) {
        alert('No available seats for this flight');
        return;
    }

    const bookingData = {
        user_id: userId,
        flight_id: flightId
    };

    axios.post('http://localhost/backend-ams/api/flight_bookings/create.php', bookingData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log(response.data); // Log the entire response data
            if (response.data.status === 'success') {
                alert('Flight booked successfully!');
                window.location.href = "list-of-flight-bookings.html";
            } else {
                alert('Failed to book flight. ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error booking the flight!', error.response ? error.response.data : error);
            alert('Failed to book flight. Please try again later.');
        });
}

function cancelBooking() {
    const bookingData = {
        user_id: userId,
        flight_id: flightId
    };

    axios.post('http://localhost/backend-ams/api/flight_bookings/delete.php', bookingData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log(response.data); // Log the entire response data
            if (response.data.status === 'success') {
                alert('Booking cancelled successfully!');
                window.location.href = "list-of-flight-bookings.html";
            } else {
                alert('Failed to cancel booking. ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error cancelling the booking!', error.response ? error.response.data : error);
            alert('Failed to cancel booking. Please try again later.');
        });
}

document.getElementById('book-flight-btn').addEventListener('click', bookFlight);
document.getElementById('cancel-booking-btn').addEventListener('click', cancelBooking);

fetchFlightDetails();