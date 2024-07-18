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
            Swal.fire('Error', 'Price per Night and Available Rooms must be positive numeric values.', 'error');
            return;
        }

        axios.post('http://localhost/backend-ams/api/hotel/create.php', formData)
            .then(response => {
                if (response.data.status === 'success') {
                    Swal.fire('Success', 'Hotel created successfully!', 'success')
                        .then(() => {
                            window.location.href = 'read.html'; 
                        });
                } else {
                    Swal.fire('Error', 'Failed to create hotel. ' + response.data.message, 'error');
                }
                form.reset();
            })
            .catch(error => {
                console.error('Error creating hotel:', error); 
                Swal.fire('Error', 'Error creating hotel. Please try again.', 'error');
            });
    } else {
        Swal.fire('Error', 'Please fill out all required fields.', 'error');
    }
}
