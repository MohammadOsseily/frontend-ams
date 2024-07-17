document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const createAirportModal = document.getElementById('createAirportModal');
    const updateAirportModal = document.getElementById('updateAirportModal');
    const createAirportButton = document.getElementById('createAirportButton');
    const closeCreateAirportModal = document.getElementById('closeCreateAirportModal');
    const closeUpdateAirportModal = document.getElementById('closeUpdateAirportModal');
    const airportTableBody = document.querySelector('#airportTable tbody');

    // Event Listeners
    createAirportButton.addEventListener('click', () => createAirportModal.style.display = 'block');
    closeCreateAirportModal.addEventListener('click', () => createAirportModal.style.display = 'none');
    closeUpdateAirportModal.addEventListener('click', () => updateAirportModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == createAirportModal) createAirportModal.style.display = 'none';
        if (event.target == updateAirportModal) updateAirportModal.style.display = 'none';
    });

    // Fetch and display airports
    function fetchAirports() {
        axios.post('http://localhost/backend-ams/api/airport/read.php')
            .then(response => {
                console.log('Response:', response);
                if (response.data.status === "success") {
                    airportTableBody.innerHTML = '';
                    response.data.data.forEach(airport => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${airport.id}</td>
                            <td>${airport.name}</td>
                            <td>${airport.location}</td>
                            <td>
                                <button onclick="showUpdateAirportModal(${airport.id}, '${airport.name}', '${airport.location}')">Update</button>
                                <button onclick="deleteAirport(${airport.id})">Delete</button>
                            </td>
                        `;
                        airportTableBody.appendChild(row);
                    });
                } else {
                    Swal.fire('Error', 'Error fetching airports: ' + response.data.message, 'error');
                }
            })
            .catch(error => {
                Swal.fire('Error', 'Error fetching airports: ' + error.message, 'error');
            });
    }

    // Create airport
    document.getElementById('createAirportForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        axios.post('http://localhost/backend-ams/api/airport/create.php', data)
            .then(response => {
                Swal.fire('Success', response.data.message, 'success');
                fetchAirports();
                event.target.reset();
                createAirportModal.style.display = 'none';
            })
            .catch(error => {
                Swal.fire('Error', 'Error creating airport: ' + error.message, 'error');
            });
    });

    // Update airport
    document.getElementById('updateAirportForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        axios.post('http://localhost/backend-ams/api/airport/update.php', data)
            .then(response => {
                Swal.fire('Success', response.data.message, 'success');
                fetchAirports();
                event.target.reset();
                updateAirportModal.style.display = 'none';
            })
            .catch(error => {
                Swal.fire('Error', 'Error updating airport: ' + error.message, 'error');
            });
    });

    // Delete airport
    window.deleteAirport = function (id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost/backend-ams/api/airport/delete.php', { id })
                    .then(response => {
                        Swal.fire('Deleted!', response.data.message, 'success');
                        fetchAirports();
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Error deleting airport: ' + error.message, 'error');
                    });
            }
        });
    };

    // Show update airport modal
    window.showUpdateAirportModal = function (id, name, location) {
        document.getElementById('update-id').value = id;
        document.getElementById('update-name').value = name;
        document.getElementById('update-location').value = location;
        updateAirportModal.style.display = 'block';
    };

    // Initial fetch
    fetchAirports();
});
