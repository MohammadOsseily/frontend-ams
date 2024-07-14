
document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Hardcoded for demonstration, replace with actual user ID logic

    axios.get(`http://localhost/backend-ams/api/flight_bookings/read-one-user.php?user_id=${userId}`)
        .then(response => {
            if (response.data && response.data.bookings && response.data.bookings.length > 0) {
                const bookings = response.data.bookings;
                const bookingsList = document.getElementById('bookings-list');

                bookings.forEach(booking => {
                    const bookingElement = document.createElement('div');
                    bookingElement.classList.add('booking-item');
                    bookingElement.innerHTML = `
                        <p><strong>Booking ID:</strong> ${booking.id}</p>
                        <p><strong>Flight ID:</strong> ${booking.flight_id}</p>
                        <p><strong>Status:</strong> ${booking.status}</p>
                        <p><strong>Booking Date:</strong> ${booking.booking_date}</p>
                        <button onclick="cancelBooking(${userId}, ${booking.flight_id})">Cancel Booking</button>
                        <hr>
                    `;
                    bookingsList.appendChild(bookingElement);
                });
            } else {
                const bookingsList = document.getElementById('bookings-list');
                bookingsList.innerHTML = '<p>No bookings found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
            const bookingsList = document.getElementById('bookings-list');
            bookingsList.innerHTML = '<p>Error fetching bookings. Please try again later.</p>';
        });
});

function cancelBooking(userId, flightId) {
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
            window.location.reload();
        } else {
            alert('Failed to cancel booking. ' + response.data.message);
        }
    })
    .catch(error => {
        console.error('There was an error cancelling the booking!', error.response ? error.response.data : error);
        alert('Failed to cancel booking. Please try again later.');
    });
}