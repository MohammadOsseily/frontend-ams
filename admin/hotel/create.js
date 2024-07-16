
function createHotel() {
    const form = document.getElementById('hotelForm');
    if (form.checkValidity()) {
        const formData = {
            name: form.elements['name'].value,
            city: form.elements['city'].value,
            address: form.elements['address'].value,
            price_per_night: parseInt(form.elements['price_per_night'].value),
            available_rooms: parseInt(form.elements['available_rooms'].value)
        };

      // Validate numeric fields
    if (isNaN(formData.price_per_night) || formData.price_per_night <= 0 || isNaN(formData.available_rooms) || formData.available_rooms <= 0) {
        alert('Price per Night and Available Rooms must be positive numeric values.');
        return;
    }

        axios.post('http://localhost/backend-ams/api/hotel/create.php', formData)
            .then(response => {
                console.log(response.data); 
                if (response.data.status === 'success') {
                    alert('Hotel created successfully!');
                    window.location.href = 'read.html'; // Redirect to read.html on success
                } else {
                    alert('Failed to create hotel. ' + response.data.message);
                }
                form.reset();
            })
            .catch(error => {
                console.error('Error creating hotel:', error); // Handle error
                alert('Error creating hotel. Please try again.');
            });
    } else {
        alert('Please fill out all required fields.');
    }
}