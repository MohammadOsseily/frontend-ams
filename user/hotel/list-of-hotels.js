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
        hotelsList.innerHTML = ''; // Clear previous content
    
        hotels.forEach(hotel => {
            const hotelDiv = document.createElement('div');
            hotelDiv.classList.add('hotel-item'); // Add hotel-item class to the div
            hotelDiv.innerHTML = `
                <a href="single-hotel.html?id=${hotel.id}" class="hotel-link">
                    Name: ${hotel.name} &nbsp;&nbsp; City: ${hotel.city} &nbsp;&nbsp; Address: ${hotel.address} &nbsp;&nbsp; Price per night: $${hotel.price_per_night}
                </a>
            `;
            hotelsList.appendChild(hotelDiv); // Append each hotel div to the hotels list
        });
    }
    

    function filterHotels() {
        const searchTerm = document.getElementById('search-bar').value.toLowerCase().trim();
        const filteredHotels = hotels.filter(hotel => 
            hotel.name.toLowerCase().includes(searchTerm) || 
            hotel.city.toLowerCase().includes(searchTerm) || 
            hotel.address.toLowerCase().includes(searchTerm)
        );
    displayHotels(filteredHotels);    
}
