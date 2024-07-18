
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

            axios.get(`http://localhost/backend-ams/api/taxi-booking/read-one-user.php?user_id=${userId}`)
                .then(response => {
                    if (response.data && response.data.data && response.data.data.length > 0) {
                        const bookings = response.data.data;
                        const bookingsList = document.getElementById('taxi-bookings-list');

                        bookings.forEach(booking => {
                            const bookingElement = document.createElement('div');
                            bookingElement.classList.add('booking-item');
                            bookingElement.innerHTML = `
                                <p><strong>Booking ID:</strong> ${booking.id}</p>
                                <p><strong>Taxi ID:</strong> ${booking.taxi_id}</p>
                                <p><strong>Status:</strong> ${booking.status}</p>
                                <p><strong>Booking Date:</strong> ${booking.booking_date}</p>
                                <button onclick="cancelTaxiBooking(${booking.id})">Cancel Booking</button>
                                <hr>
                            `;
                            bookingsList.appendChild(bookingElement);
                        });
                    } else {
                        const bookingsList = document.getElementById('taxi-bookings-list');
                        bookingsList.innerHTML = '<p>No bookings found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching bookings:', error);
                    const bookingsList = document.getElementById('taxi-bookings-list');
                    bookingsList.innerHTML = '<p>Error fetching bookings. Please try again later.</p>';
                });
        });

        function cancelTaxiBooking(bookingId) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you really want to cancel this booking?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, cancel it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const bookingData = {
                        id: bookingId
                    };

                    axios.post('http://localhost/backend-ams/api/taxi-booking/delete.php', bookingData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(response => {
                        console.log(response.data); // Log the entire response data
                        if (response.data.status === 'success') {
                            Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success')
                                .then(() => {
                                    window.location.reload();
                                });
                        } else {
                            Swal.fire('Error', 'Failed to cancel booking. ' + response.data.message, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('There was an error cancelling the booking!', error.response ? error.response.data : error);
                        Swal.fire('Error', 'Failed to cancel booking. Please try again later.', 'error');
                    });
                }
            });
        }
