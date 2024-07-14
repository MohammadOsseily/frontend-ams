const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('id');

// Fetch hotel details and populate the form
function fetchHotelDetails() {
    axios.get(`http://localhost/backend-ams/api/hotel/read-one.php?id=${hotelId}`)
        .then(response => {
            if (response.data && response.data.data) {
                const hotel = response.data.data;
                document.getElementById('hotel_id').value = hotel.id;
                document.getElementById('name').value = hotel.name;
                document.getElementById('price_per_night').value = hotel.price_per_night;
                document.getElementById('available_rooms').value = hotel.available_rooms;
                document.getElementById('city').value = hotel.city;
                document.getElementById('address').value = hotel.address;
            } else {
                console.error('No hotel found in response', response.data);
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the hotel!', error);
        });
}

// Handle form submission for updating hotel
document.getElementById('update-hotel-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const pricePerNight = document.getElementById('price_per_night').value;
    const availableRooms = document.getElementById('available_rooms').value;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;
    // Prepare data for update
    const hotelData = {
        id: hotelId,
        name: name,
        price_per_night: pricePerNight,
        available_rooms: availableRooms,
        city: city,
        address: address
    };
    // Debug console logs
console.log('Hotel data to send:', hotelData);

    // Send update request
    axios.post('http://localhost/backend-ams/api/hotel/update.php', hotelData)
        .then(response => {
            if (response.data.status === 'success') {
                alert('Hotel updated successfully!');
                window.location.href = 'read.html';
            } else {
                alert('Failed to update hotel. ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('There was an error updating the hotel!', error);
            alert('Failed to update hotel. Please try again later.');
        });
});

// Fetch hotel details on page load
fetchHotelDetails();
