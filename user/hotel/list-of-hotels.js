
axios.get('http://localhost/backend-ams/api/hotel/read.php')
    .then(response => {
        if (response.data && response.data.hotels) {
            const hotels = response.data.hotels;
            const hotelsList = document.getElementById('hotels-list');
            hotels.forEach(hotel => {
                // Create a clickable link for each hotel
                const hotelLink = document.createElement('a');
                hotelLink.textContent = `${hotel.name} - ${hotel.city} - ${hotel.address} - $${hotel.price_per_night}`;
                hotelLink.href = `single-hotel.html?id=${hotel.id}`;
                hotelLink.style.display = 'block';
                hotelLink.style.marginBottom = '10px';
                hotelsList.appendChild(hotelLink);
            });
        } else {
            console.error('No hotels found in response', response.data);
        }
    })
    .catch(error => {
        console.error('There was an error retrieving the hotels!', error);
    });