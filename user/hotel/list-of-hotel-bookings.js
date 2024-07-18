document.addEventListener('DOMContentLoaded', function() {
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
    

    axios.get(`http://localhost/backend-ams/api/hotel_bookings/read-one-user.php?user_id=${userId}`)
    
        .then(response => {
            if (response.data && response.data.bookings && response.data.bookings.length > 0) {
                const bookings = response.data.bookings;
                const bookingsList = document.getElementById('bookings-list');

                bookings.forEach(booking => {
                    const bookingElement = document.createElement('div');
                    bookingElement.classList.add('booking-item');
                    bookingElement.innerHTML = `
                        <p><strong>Booking ID:</strong> ${booking.id}</p>
                        <p><strong>Hotel ID:</strong> ${booking.hotel_id}</p>
                        <p><strong>Status:</strong> ${booking.status}</p>
                        <p><strong>Check-in Date:</strong> ${booking.check_in_date}</p>
                        <p><strong>Check-out Date:</strong> ${booking.check_out_date}</p>
                        <p><strong>Booking Date:</strong> ${booking.booking_date}</p>
                        <button onclick="cancelBooking(${booking.id})">Cancel Booking</button>
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

function cancelBooking(bookingId) {
    axios.post('http://localhost/backend-ams/api/hotel_bookings/delete.php', { id: bookingId }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.status === 'success') {
            Swal.fire({
                title: 'Booking Cancelled',
                text: 'Booking cancelled successfully!',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(() => {
                window.location.reload();
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
