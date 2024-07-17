document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const createUserModal = document.getElementById('createUserModal');
    const updateUserModal = document.getElementById('updateUserModal');
    const createUserButton = document.getElementById('createUserButton');
    const closeCreateModal = document.getElementById('closeCreateModal');
    const closeUpdateModal = document.getElementById('closeUpdateModal');
    const userTableBody = document.querySelector('#userTable tbody');

    // Event Listeners
    createUserButton.addEventListener('click', () => createUserModal.style.display = 'block');
    closeCreateModal.addEventListener('click', () => createUserModal.style.display = 'none');
    closeUpdateModal.addEventListener('click', () => updateUserModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == createUserModal) createUserModal.style.display = 'none';
        if (event.target == updateUserModal) updateUserModal.style.display = 'none';
    });

    // Fetch and display users
    function fetchUsers() {
        axios.post('http://localhost/backend-ams/api/user/read.php')
            .then(response => {
                console.log('Response:', response);
                if (response.data.status === "success") {
                    userTableBody.innerHTML = '';
                    response.data.data.forEach(user => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.role}</td>
                            <td>
                                <button onclick="showUpdateUserModal(${user.id}, '${user.username}', '${user.email}', '${user.first_name}', '${user.last_name}', '${user.role}')">Update</button>
                                <button onclick="deleteUser(${user.id})">Delete</button>
                            </td>
                        `;
                        userTableBody.appendChild(row);
                    });
                } else {
                    Swal.fire('Error', 'Error fetching users: ' + response.data.message, 'error');
                }
            })
            .catch(error => {
                Swal.fire('Error', 'Error fetching users: ' + error.message, 'error');
            });
    }

    // Create user
    document.getElementById('createUserForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        axios.post('http://localhost/backend-ams/api/user/create.php', data)
            .then(response => {
                Swal.fire('Success', response.data.message, 'success');
                fetchUsers();
                event.target.reset();
                createUserModal.style.display = 'none';
            })
            .catch(error => {
                Swal.fire('Error', 'Error creating user: ' + error.message, 'error');
            });
    });

    // Update user
    document.getElementById('updateUserForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        axios.post('http://localhost/backend-ams/api/user/update.php', data)
            .then(response => {
                Swal.fire('Success', response.data.message, 'success');
                fetchUsers();
                event.target.reset();
                updateUserModal.style.display = 'none';
            })
            .catch(error => {
                Swal.fire('Error', 'Error updating user: ' + error.message, 'error');
            });
    });

    // Delete user
    window.deleteUser = function (id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost/backend-ams/api/user/delete.php', { id })
                    .then(response => {
                        Swal.fire('Deleted!', response.data.message, 'success');
                        fetchUsers();
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Error deleting user: ' + error.message, 'error');
                    });
            }
        });
    };

    // Show update user modal
    window.showUpdateUserModal = function (id, username, email, firstName, lastName, role) {
        document.getElementById('update-id').value = id;
        document.getElementById('update-username').value = username;
        document.getElementById('update-email').value = email;
        document.getElementById('update-first-name').value = firstName;
        document.getElementById('update-last-name').value = lastName;
        document.getElementById('update-role').value = role;
        updateUserModal.style.display = 'block';
    };

    // Initial fetch
    fetchUsers();
});
