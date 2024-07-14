
const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('id');
const userId = 1; // Hardcoded user ID for now

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
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the hotel!', error);
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
    alert("Check-in date cannot be before the current date.");
    checkInDateInput.focus();
    return;
}

if (selectedCheckInDate >= new Date(checkOutDate)) {
    alert("Check-out date must be later than check-in date.");
    checkOutDateInput.focus();
    return;
}

const bookingData = {
    user_id: 1, // Hardcoded user ID for demonstration
    hotel_id: hotelId,
    check_in_date: checkInDate,
    check_out_date: checkOutDate
};

axios.post('http://localhost/backend-ams/api/hotel_bookings/create.php', bookingData)
    .then(response => {
        if (response.data && response.data.status === 'success') {
            alert('Hotel booked successfully!');
            window.location.href = "list-of-hotel-bookings.html";
        } else {
            alert('Failed to book hotel. ' + response.data.message);
        }
    })
    .catch(error => {
        console.error('There was an error booking the hotel!', error);
        alert('Failed to book hotel. Please try again later.');
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
                alert('Booking cancelled successfully!');
                window.location.href = "list-of-hotel-bookings.html";
            } else {
                alert('Failed to cancel booking. ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error cancelling the booking!', error);
            alert('Failed to cancel booking. Please try again later.');
        });
}

document.getElementById('book-hotel-btn').addEventListener('click', bookHotel);
document.getElementById('cancel-booking-btn').addEventListener('click', cancelBooking);

fetchHotelDetails();