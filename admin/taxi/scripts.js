document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const createTaxiModal = document.getElementById('createTaxiModal');
    const updateTaxiModal = document.getElementById('updateTaxiModal');
    const createTaxiButton = document.getElementById('createTaxiButton');
    const closeCreateTaxiModal = document.getElementById('closeCreateTaxiModal');
    const closeUpdateTaxiModal = document.getElementById('closeUpdateTaxiModal');
    const taxiTableBody = document.querySelector('#taxiTable tbody');

    // Event Listeners
    createTaxiButton.addEventListener('click', () => createTaxiModal.style.display = 'block');
    closeCreateTaxiModal.addEventListener('click', () => createTaxiModal.style.display = 'none');
    closeUpdateTaxiModal.addEventListener('click', () => updateTaxiModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == createTaxiModal) createTaxiModal.style.display = 'none';
        if (event.target == updateTaxiModal) updateTaxiModal.style.display = 'none';
    });

    // Fetch and display taxis
    function fetchTaxis() {
        axios.post('http://localhost/backend-ams/api/taxi/read.php')
            .then(response => {
                console.log('Response:', response);
                if (response.data.status === "success") {
                    taxiTableBody.innerHTML = '';
                    response.data.data.forEach(taxi => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${taxi.id}</td>
                            <td>${taxi.company_name}</td>
                            <td>${taxi.city}</td>
                            <td>${taxi.phone_number}</td>
                            <td>${taxi.price_per_km}</td>
                            <td>
                                <button onclick="showUpdateTaxiModal(${taxi.id}, '${taxi.company_name}', '${taxi.city}', '${taxi.phone_number}', ${taxi.price_per_km})">Update</button>
                                <button onclick="deleteTaxi(${taxi.id})">Delete</button>
                            </td>
                        `;
                        taxiTableBody.appendChild(row);
                    });
                } else {
                    Swal.fire('Error', 'Error fetching taxis: ' + response.data.message, 'error');
                }
            })
            .catch(error => {
                Swal.fire('Error', 'Error fetching taxis: ' + error.message, 'error');
            });
    }

    // Create taxi
    document.getElementById('createTaxiForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        axios.post('http://localhost/backend-ams/api/taxi/create.php', data)
            .then(response => {
                Swal.fire('Success', response.data.message, 'success');
                fetchTaxis();
                event.target.reset();
                createTaxiModal.style.display = 'none';
            })
            .catch(error => {
                Swal.fire('Error', 'Error creating taxi: ' + error.message, 'error');
            });
    });

    // Update taxi
    document.getElementById('updateTaxiForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        axios.post('http://localhost/backend-ams/api/taxi/update.php', data)
            .then(response => {
                Swal.fire('Success', response.data.message, 'success');
                fetchTaxis();
                event.target.reset();
                updateTaxiModal.style.display = 'none';
            })
            .catch(error => {
                Swal.fire('Error', 'Error updating taxi: ' + error.message, 'error');
            });
    });

    // Delete taxi
    window.deleteTaxi = function (id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost/backend-ams/api/taxi/delete.php', { id })
                    .then(response => {
                        Swal.fire('Deleted!', response.data.message, 'success');
                        fetchTaxis();
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Error deleting taxi: ' + error.message, 'error');
                    });
            }
        });
    };

    // Show update taxi modal
    window.showUpdateTaxiModal = function (id, companyName, city, phoneNumber, pricePerKm) {
        document.getElementById('update-id').value = id;
        document.getElementById('update-company-name').value = companyName;
        document.getElementById('update-city').value = city;
        document.getElementById('update-phone-number').value = phoneNumber;
        document.getElementById('update-price-per-km').value = pricePerKm;
        updateTaxiModal.style.display = 'block';
    };

    // Initial fetch
    fetchTaxis();
});
