document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        
        console.log( "no token")
        window.location.href = '/user/auth/login.html';
        
    } else {
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const decodedToken = JSON.parse(jsonPayload);

        if (decodedToken.data.role !== 'admin') {
            
            console.log( "not admin")
            console.log(decodedToken)
            window.location.href = '/user/auth/login.html';
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', () => {
        
        localStorage.setItem('jwtToken', '');
        location.reload();
        
    });
});

