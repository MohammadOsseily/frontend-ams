document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post('http://localhost/backend-ams/api/user/auth/login.php', {
                username: username,
                password: password
            });

            if (response.data.status === 'success') {
                const token = response.data.jwt;

                localStorage.setItem('jwtToken', token);
                // Decode the JWT token
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                const role = decodedToken.data.role;
                
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: `Welcome ${role}!`,
                }).then(() => {
                    // Redirect to dashboard or another page
                    if (role === 'admin') {
                        window.location.href = '../../admin/dashboard/index.html'; // Redirect to admin dashboard
                    } else {
                        window.location.href = '/index.html'; // Redirect to user dashboard
                    }
                    
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: response.data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: 'Unable to login. Please try again later.',
            });
        }
    });
});
