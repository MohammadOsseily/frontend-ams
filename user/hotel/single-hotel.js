
const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('id');
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('jwtToken');

    let dtoken;

   
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decodedToken = JSON.parse(jsonPayload);
        
    dtoken = decodedToken.data.id;
    

    let userId = dtoken;
    

function fetchHotelDetails() {
    axios.get(`http://localhost/backend-ams/api/hotel/read-one.php?id=${hotelId}`)
        .then(response => {
            if (response.data && response.data.data) {
                const hotel = response.data.data;
                const hotelDetails = document.getElementById('hotel-details');
                hotelDetails.innerHTML = `
                    <p>Hotel Name: ${hotel.name || 'No Hotel Name'}</p>
                    <p>City: ${hotel.city || 'No City'}</p>
                    <p>Address: ${hotel.address || 'No Address'}</p>
                    <p>Price per Night: ${hotel.price_per_night || 'No Price'}</p>
                    <p>Available Rooms: ${hotel.available_rooms || 'No Rooms Available'}</p>
                `;
                checkBookingStatus();
            } else {
                console.error('No hotel found in response', response.data);
                Swal.fire({
                    title: 'No Hotel Found',
                    text: 'No Hotel details found in the response.',
                    icon: 'info',
                    confirmButtonText: 'Okay'
                });
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the hotel!', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error retrieving the Hotel. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        });
}

function checkBookingStatus() {
    axios.get(`http://localhost/backend-ams/api/hotel_bookings/read-one.php?user_id=${userId}&hotel_id=${hotelId}`)
        .then(response => {
            const bookingSection = document.getElementById('booking-section');
            if (response.data.status === "success" && response.data.data) {
                document.getElementById('cancel-booking-btn').style.display = 'block';
            } else {
                document.getElementById('book-hotel-btn').style.display = 'block';
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

function bookHotel() {
const checkInDateInput = document.getElementById('check_in_date');
const checkOutDateInput = document.getElementById('check_out_date');

const checkInDate = checkInDateInput.value;
const checkOutDate = checkOutDateInput.value;

const currentDate = new Date();
const selectedCheckInDate = new Date(checkInDate);

if (selectedCheckInDate < currentDate) {
    Swal.fire({
        title: 'Error',
        text: 'Check-in date can not be before the current date',
        icon: 'warning',
        confirmButtonText: 'Okay'
    });
    checkInDateInput.focus();
    return;
}

if (selectedCheckInDate >= new Date(checkOutDate)) {
    Swal.fire({
        title: 'Error',
        text: 'Check-out date must be later than check-in date',
        icon: 'warning',
        confirmButtonText: 'Okay'
    });
    checkOutDateInput.focus();
    return;
}

const bookingData = {
    user_id: userId, // Hardcoded user ID for demonstration
    hotel_id: hotelId,
    check_in_date: checkInDate,
    check_out_date: checkOutDate
};

axios.post('http://localhost/backend-ams/api/hotel_bookings/create.php', bookingData)
    .then(response => {
        if (response.data && response.data.status === 'success') {
            Swal.fire({
                title: 'Flight Booked',
                text: 'Flight booked successfully!',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(() => {
                window.location.href = "list-of-hotel-bookings.html";
            });
        } else {
            Swal.fire({
                title: 'Booking Failed',
                text: `Failed to book Hotel. ${response.data.message}`,
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    })
    .catch(error => {
        console.error('There was an error booking the hotel!', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to book Hotel. Please try again later.',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
    });
}

function cancelBooking() {
    const bookingData = {
        user_id: userId,
        hotel_id: hotelId
    };

    axios.post('http://localhost/backend-ams/api/hotel_bookings/delete.php', bookingData)
        .then(response => {
            if (response.data && response.data.status === 'success') {
                Swal.fire({
                    title: 'Booking Cancelled',
                    text: 'Booking cancelled successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                }).then(() => {
                    window.location.href = "list-of-hotel-bookings.html";
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
            console.error('There was an error cancelling the booking!', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to cancel booking. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });        });
}

document.getElementById('book-hotel-btn').addEventListener('click', bookHotel);
document.getElementById('cancel-booking-btn').addEventListener('click', cancelBooking);

fetchHotelDetails();})