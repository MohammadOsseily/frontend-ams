const urlParams = new URLSearchParams(window.location.search);
const flightId = urlParams.get('id');

const token = localStorage.getItem('jwtToken');

    let dtoken;

   
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    let decodedToken = JSON.parse(jsonPayload);
        
    dtoken = decodedToken.data.id;
    

    let userId = dtoken;
    
let departureTime;
let capacity;

function fetchFlightDetails() {
    
    axios.get(`http://localhost/backend-ams/api/flight/read-one.php?id=${flightId}`)
    console.log(`http://localhost/backend-ams/api/flight/read-one.php?id=${flightId}`)
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
                Swal.fire({
                    title: 'No Flight Found',
                    text: 'No flight details found in the response.',
                    icon: 'info',
                    confirmButtonText: 'Okay'
                });
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the flight!', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error retrieving the flight. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
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
            Swal.fire({
                title: 'Error',
                text: 'There was an error checking the booking status. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        });
}

function bookFlight() {
    if (new Date() > departureTime) {
        Swal.fire({
            title: 'Cannot Book Flight',
            text: 'Cannot book a flight that has already departed.',
            icon: 'warning',
            confirmButtonText: 'Okay'
        });
        return;
    }

    if (capacity <= 0) {
        Swal.fire({
            title: 'No Available Seats',
            text: 'No available seats for this flight.',
            icon: 'warning',
            confirmButtonText: 'Okay'
        });
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
        if (response.data.status === 'success') {
            Swal.fire({
                title: 'Flight Booked',
                text: 'Flight booked successfully!',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(() => {
                window.location.href = "list-of-flight-bookings.html";
            });
        } else {
            Swal.fire({
                title: 'Booking Failed',
                text: `Failed to book flight. ${response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    })
    .catch(error => {
        console.error('There was an error booking the flight!', error.response ? error.response.data : error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to book flight. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
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
        console.log(response.data);
        if (response.data.status === 'success') {
            Swal.fire({
                title: 'Booking Cancelled',
                text: 'Booking cancelled successfully!',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(() => {
                window.location.href = "list-of-flight-bookings.html";
            });
        } else {
            Swal.fire({
                title: 'Cancellation Failed',
                text: `Failed to cancel booking. ${response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    })
    .catch(error => {
        console.error('There was an error cancelling the booking!', error.response ? error.response.data : error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to cancel booking. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    });
}

document.getElementById('book-flight-btn').addEventListener('click', bookFlight);
document.getElementById('cancel-booking-btn').addEventListener('click', cancelBooking);

fetchFlightDetails();
