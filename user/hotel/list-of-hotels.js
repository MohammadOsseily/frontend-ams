let hotels = [];

axios.get('http://localhost/backend-ams/api/hotel/read.php')
    .then(response => {
        if (response.data && response.data.hotels) {
            hotels = response.data.hotels;
            displayHotels(hotels);
        } else {
            console.error('No hotels found in response', response.data);
        }
    })
    .catch(error => {
        console.error('There was an error retrieving the hotels!', error);
    });

function displayHotels(hotels) {
    const hotelsList = document.getElementById('hotels-list');
    hotelsList.innerHTML = '';
    hotels.forEach(hotel => {
        // Create a clickable link for each hotel
        const hotelLink = document.createElement('a');
        hotelLink.textContent = `${hotel.name} - ${hotel.city} - ${hotel.address} - $${hotel.price_per_night}`;
        hotelLink.href = `single-hotel.html?id=${hotel.id}`;
        hotelLink.style.display = 'block';
        hotelLink.style.marginBottom = '10px';
        hotelsList.appendChild(hotelLink);
    });
}

function filterHotels() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredHotels = hotels.filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm) || 
        hotel.city.toLowerCase().includes(searchTerm) || 
        hotel.address.toLowerCase().includes(searchTerm)
    );
    displayHotels(filteredHotels);
}
