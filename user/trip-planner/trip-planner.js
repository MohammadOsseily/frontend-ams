
function submitForm() {
    const departureCity = document.getElementById('departure_city').value;
    const destinationCity = document.getElementById('destination_city').value;
    const date = document.getElementById('date').value;
    const budget = document.getElementById('budget').value;
    const days = document.getElementById('days').value;

    const requestData = {
        departure_city: departureCity,
        city: destinationCity,
        date: date,
        budget: budget,
        days: days
    };

    fetch('http://localhost/backend-ams/api/trip_planner.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const tripPlanDiv = document.getElementById('trip-plan');
        if (data.trip_plan) {
            let formattedTripPlan = data.trip_plan;
            formattedTripPlan = formattedTripPlan.replace(/###\s(.*)/g, '<h3>$1</h3>');
            formattedTripPlan = formattedTripPlan.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            formattedTripPlan = formattedTripPlan.replace(/---/g, '<hr>');
            formattedTripPlan = formattedTripPlan.replace(/^- (.*)/gm, '<li>$1</li>');

            tripPlanDiv.innerHTML = `<h3>Trip Plan:</h3><div>${formattedTripPlan}</div>`;
            tripPlanDiv.style.display = 'block';
        } else {
            tripPlanDiv.innerHTML = '<h3>No valid trip found within the specified budget.</h3>';
            tripPlanDiv.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}