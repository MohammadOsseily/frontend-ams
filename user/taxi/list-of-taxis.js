document.addEventListener('DOMContentLoaded', function() {
    let taxis = [];

    // Function to fetch and display taxi data
    function fetchTaxis() {
        axios.post('http://localhost/backend-ams/api/taxi/read.php')
            .then(response => {
                if (response.data && response.data.status === 'success' && response.data.data) {
                    taxis = response.data.data;
                    displayTaxis(taxis);
                } else {
                    console.error('No taxis found in response', response.data);
                    Swal.fire({
                        title: 'No Taxis Found',
                        text: 'There were no taxis found in the response.',
                        icon: 'info',
                        confirmButtonText: 'Okay'
                    });
                }
            })
            .catch(error => {
                console.error('There was an error retrieving the taxis!', error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an error retrieving the taxis. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
            });
    }

    // Function to display the taxi data
    function displayTaxis(taxis) {
        const taxisList = document.getElementById('taxis-list');
        taxisList.innerHTML = ''; // Clear the previous content

        taxis.forEach(taxi => {
            const taxiDiv = document.createElement('div');
            taxiDiv.classList.add('taxi-item');
            taxiDiv.innerHTML = `
                <a href="single-taxi.html?id=${taxi.id}">
                    ${taxi.company_name || 'No Company Name'} - ${taxi.city || 'No City'}, ${taxi.phone_number || 'No Phone Number'} - $${taxi.price_per_km || 'No Price'} per km
                </a>
            `;
            taxisList.appendChild(taxiDiv);
        });
    }

    // Function to filter taxis based on search term
    function filterTaxis() {
        const searchTerm = document.getElementById('search-bar').value.toLowerCase();
        const filteredTaxis = taxis.filter(taxi => 
            (taxi.company_name && taxi.company_name.toLowerCase().includes(searchTerm)) || 
            (taxi.city && taxi.city.toLowerCase().includes(searchTerm))
        );
        displayTaxis(filteredTaxis);
    }

    // Event listener for search bar
    document.getElementById('search-bar').addEventListener('input', filterTaxis);

    // Fetch and display taxis on page load
    fetchTaxis();
});
