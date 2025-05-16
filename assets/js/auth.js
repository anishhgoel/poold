document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname.endsWith('/');
    const isRegisterPage = window.location.pathname.includes('register.html');
    
    // Login page functionality
    if (isLoginPage) {
        const loginForm = document.getElementById('login-form');
        const loginButton = loginForm.querySelector('.btn-primary');
        
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would typically send this data to your backend
            console.log('Login attempt with:', { email });
            
            // For demo purposes, simulate successful login
            alert('Login successful! Redirecting to dashboard...');
            // window.location.href = 'dashboard.html';
        });
        
        // Google Sign In handler
        const googleButton = loginForm.querySelector('.google-btn');
        if (googleButton) {
            googleButton.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Google sign-in would be implemented with Firebase or Google OAuth.');
                // Here you would implement Google OAuth
            });
        }
    }
    
    // Registration page functionality
    if (isRegisterPage) {
        const registerForm = document.getElementById('register-form');
        const registerButton = registerForm.querySelector('.btn-primary');
        
        registerButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const username = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            const dob = registerForm.querySelector('input[type="date"]').value;
            
            if (!username || !email || !password || !dob) {
                alert('Please fill in all fields');
                return;
            }
            
            // Validate date of birth (18+ check)
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (age < 18) {
                alert('You must be at least 18 years old to register.');
                return;
            }
            
            // Here you would typically send this data to your backend
            console.log('Registration with:', { username, email, dob });
            
            // For demo purposes, simulate successful registration
            alert('Registration successful! Redirecting to login page...');
            window.location.href = 'login.html';
        });
        
        // Google Sign In handler
        const googleButton = registerForm.querySelector('.google-btn');
        if (googleButton) {
            googleButton.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Google sign-up would be implemented with Firebase or Google OAuth.');
                // Here you would implement Google OAuth
            });
        }
    }
}); 