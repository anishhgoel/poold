/*==================== FORM SWITCHING ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const signUpLink = document.getElementById('sign-up');
    const signInLink = document.getElementById('sign-in');
    
    // Switch to sign-up form
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    // Switch to sign-in form
    signInLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    // Login submission
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
    
    // Register submission
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
        alert('Registration successful! Please log in.');
        
        // Switch to login form
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    // Google Sign In handler
    const googleButtons = document.querySelectorAll('.google-btn');
    googleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Google sign-in would be implemented with Firebase or Google OAuth.');
            // Here you would implement Google OAuth
        });
    });
});

// Convert SVG logo to PNG for browsers that don't support SVG well
document.addEventListener('DOMContentLoaded', () => {
    // For the index.html loader
    const logoImg = document.querySelector('.loader img');
    if (logoImg && logoImg.src.endsWith('.svg')) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            try {
                const dataUrl = canvas.toDataURL('image/png');
                logoImg.src = dataUrl;
            } catch (e) {
                console.error('Error converting SVG to PNG', e);
            }
        };
        
        img.src = logoImg.src;
    }
}); 