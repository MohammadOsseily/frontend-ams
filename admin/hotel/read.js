
        function fetchHotels() {
            axios.get('http://localhost/backend-ams/api/hotel/read.php')
                .then(response => {
                    if (response.data && response.data.hotels) {
                        const hotels = response.data.hotels;
                        const hotelsList = document.getElementById('hotels-list');
                        hotelsList.innerHTML = ''; 

                        hotels.forEach(hotel => {
                            const hotelDiv = document.createElement('div');
                            hotelDiv.innerHTML = `
                                <a href="../../user/hotel/single-hotel.html?id=${hotel.id}">
                                    Hotel Name: ${hotel.name || 'No Hotel Name'} - 
                                    City: ${hotel.city || 'No City'} - 
                                    Available Rooms: ${hotel.available_rooms || 'No Rooms Available'} - 
                                    Price per Night: ${hotel.price_per_night || 'No Price'}
                                </a>
                                <a href="update.html?id=${hotel.id}">Update</a>
                                <a href="#" onclick="deleteHotel(${hotel.id})">Delete</a>
                            `;
                            hotelsList.appendChild(hotelDiv);
                        });
                    } else {
                        console.error('No hotels found in response', response.data);
                    }
                })
                .catch(error => {
                    console.error('There was an error retrieving the hotels!', error);
                });
        }

        // Function to delete a hotel
        function deleteHotel(hotelId) {
            if (confirm('Are you sure you want to delete this hotel?')) {
                axios({
                    method: 'post',
                    url: 'http://localhost/backend-ams/api/hotel/delete.php',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        id: hotelId
                    }
                })
                .then(response => {
                    if (response.data.status === 'success') {
                        alert('Hotel deleted successfully!');
                        location.reload(); // Reload the page to reflect changes
                    } else {
                        alert('Failed to delete hotel. ' + response.data.message);
                    }
                })
                .catch(error => {
                    console.error('There was an error deleting the hotel!', error);
                    alert('Failed to delete hotel. Please try again later.');
                });
            }
        }

        // Fetch hotels when the page loads
        fetchHotels();