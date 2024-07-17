function fetchHotels() {
    axios.get('http://localhost/backend-ams/api/hotel/read.php')
        .then(response => {
            if (response.data && response.data.hotels) {
                const hotels = response.data.hotels;
                const hotelsList = document.getElementById('hotels-list');
                hotelsList.innerHTML = '';

                hotels.forEach(hotel => {
                    const hotelDiv = document.createElement('div');
                    hotelDiv.classList.add('hotel-item');
                    hotelDiv.innerHTML = `
                        <a href="../../user/hotel/single-hotel.html?id=${hotel.id}">
                            Hotel Name: ${hotel.name || 'No Hotel Name'} - 
                            City: ${hotel.city || 'No City'} - 
                            Available Rooms: ${hotel.available_rooms || 'No Rooms Available'} - 
                            Price per Night: ${hotel.price_per_night || 'No Price'}
                        </a>
                        <div class="admin-actions">
                            <a href="update.html?id=${hotel.id}" class="update-link button-link">Update</a>
                            <a href="#" class="delete-link button-link" onclick="deleteHotel(${hotel.id})">Delete</a>
                        </div>
                    `;
                    hotelsList.appendChild(hotelDiv);
                });
            } else {
                console.error('No hotels found in response', response.data);
                Swal.fire('Error', 'No hotels found.', 'error');
            }
        })
        .catch(error => {
            console.error('There was an error retrieving the hotels!', error);
            Swal.fire('Error', 'Failed to retrieve hotels. Please try again later.', 'error');
        });
}

function deleteHotel(hotelId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post('http://localhost/backend-ams/api/hotel/delete.php', { id: hotelId })
                .then(response => {
                    if (response.data.status === 'success') {
                        Swal.fire('Deleted!', 'Hotel has been deleted.', 'success')
                            .then(() => {
                                fetchHotels(); // Reload the hotels list to reflect changes
                            });
                    } else {
                        Swal.fire('Error', 'Failed to delete hotel. ' + response.data.message, 'error');
                    }
                })
                .catch(error => {
                    console.error('There was an error deleting the hotel!', error);
                    Swal.fire('Error', 'Failed to delete hotel. Please try again later.', 'error');
                });
        }
    });
}

fetchHotels();
