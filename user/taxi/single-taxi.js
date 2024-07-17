const urlParams = new URLSearchParams(window.location.search);
const taxiId = urlParams.get('id');
const userId = 12; // Hardcoded user ID for now

function fetchTaxiDetails() {
    axios.post('http://localhost/backend-ams/api/taxi/read-one.php', { id: taxiId })
        .then(response => {
            if (response.data && response.data.data) {
                const taxi = response.data.data;
                const taxiDetails = document.getElementById('taxi-details');

                taxiDetails.innerHTML = `
                    <p>Company Name: ${taxi.company_name || 'No Company Name'}</p>
                    <p>City: ${taxi.city || 'No City'}</p>
                    <p>Phone Number: ${taxi.phone_number || 'No Phone Number'}</p>
                    <p>Price per km: $${taxi.price_per_km || 'No Price'}</p>
                `;
                checkBookingStatus();
            } else {
                console.error('No taxi found in response', response.data);
                Swal.fire({
                    title: 'No Taxi Found',
                    text: 'No taxi details found in the response.',
                    icon: 'info',
                    confirmButtonText: 'Okay'
                });
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the taxi!', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error retrieving the taxi. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        });
}

function checkBookingStatus() {
    axios.get(`http://localhost/backend-ams/api/taxi-booking/read-one-user.php?user_id=${userId}`)
        .then(response => {
            if (response.data && response.data.bookings) {
                const bookings = response.data.bookings;
                const bookingsList = document.getElementById('bookings-list');
                bookingsList.innerHTML = '';

                bookings.forEach(booking => {
                    if (booking.taxi_id === parseInt(taxiId)) {
                        const bookingElement = document.createElement('div');
                        bookingElement.classList.add('booking-item');
                        bookingElement.innerHTML = `
                            <p><strong>Booking ID:</strong> ${booking.id}</p>
                            <p><strong>Taxi ID:</strong> ${booking.taxi_id}</p>
                            <p><strong>Status:</strong> ${booking.status}</p>
                            <p><strong>Booking Date:</strong> ${booking.booking_date}</p>
                            <button onclick="cancelBooking(${userId}, ${booking.taxi_id})">Cancel Booking</button>
                            <hr>
                        `;
                        bookingsList.appendChild(bookingElement);
                    }
                });

                if (!bookings.length) {
                    document.getElementById('book-taxi-btn').style.display = 'block';
                } else {
                    document.getElementById('cancel-booking-btn').style.display = 'block';
                }
            } else {
                document.getElementById('book-taxi-btn').style.display = 'block';
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

document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const pickUpLocation = document.getElementById('pick_up_location').value;
    const dropOffLocation = document.getElementById('drop_off_location').value;
    const pickUpTime = document.getElementById('pick_up_time').value;

    const bookingData = {
        user_id: userId,
        taxi_id: taxiId,
        pick_up_location: pickUpLocation,
        drop_off_location: dropOffLocation,
        pick_up_time: pickUpTime
    };

    axios.post('http://localhost/backend-ams/api/taxi-booking/create.php', bookingData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.data.status === 'success') {
            Swal.fire({
                title: 'Taxi Booked',
                text: 'Taxi booked successfully!',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(() => {
                window.location.href = "list-of-taxi-bookings.html";
            });
        } else {
            Swal.fire({
                title: 'Booking Failed',
                text: `Failed to book taxi. ${response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    })
    .catch(error => {
        console.error('There was an error booking the taxi!', error.response ? error.response.data : error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to book taxi. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    });
});


fetchTaxiDetails();
