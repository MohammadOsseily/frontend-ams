const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('id');

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
                Swal.fire('Error', 'No hotel found.', 'error');
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the hotel!', error);
            Swal.fire('Error', 'Failed to retrieve hotel details. Please try again later.', 'error');
        });
}

document.getElementById('update-hotel-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const pricePerNight = document.getElementById('price_per_night').value;
    const availableRooms = document.getElementById('available_rooms').value;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;

    // Validate numeric fields
    if (isNaN(pricePerNight) || pricePerNight <= 0 || isNaN(availableRooms) || availableRooms <= 0) {
        Swal.fire('Error', 'Price per Night and Available Rooms must be positive numeric values.', 'error');
        return;
    }

    const hotelData = {
        id: hotelId,
        name: name,
        price_per_night: pricePerNight,
        available_rooms: availableRooms,
        city: city,
        address: address
    };

    axios.post('http://localhost/backend-ams/api/hotel/update.php', hotelData)
        .then(response => {
            if (response.data.status === 'success') {
                Swal.fire('Success', 'Hotel updated successfully!', 'success')
                    .then(() => {
                        window.location.href = 'read.html';
                    });
            } else {
                Swal.fire('Error', 'Failed to update hotel. ' + response.data.message, 'error');
            }
        })
        .catch(error => {
            console.error('There was an error updating the hotel!', error);
            Swal.fire('Error', 'Failed to update hotel. Please try again later.', 'error');
        });
});

fetchHotelDetails();
