import { supabaseClient } from './supabase-config.js';

// Wait for Supabase to be initialized
function waitForSupabase() {
    return new Promise((resolve) => {
        const checkSupabase = () => {
            if (supabaseClient) {
                resolve();
            } else {
                setTimeout(checkSupabase, 100);
            }
        };
        checkSupabase();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be ready
        await waitForSupabase();
        
        // Check which page we're on
        const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname.endsWith('/');
        const isRegisterPage = window.location.pathname.includes('register.html');
        
        // Check authentication status
        supabaseClient.auth.onAuthStateChange((event, session) => {
            // User is on login or register page but already logged in
            if ((isLoginPage || isRegisterPage) && session) {
                window.location.href = 'dashboard.html';
            }
        });
        
        // Login page functionality
        if (isLoginPage) {
            const loginForm = document.getElementById('login-form');
            const loginButton = loginForm.querySelector('.btn-primary');
            
            loginButton.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                
                if (!email || !password) {
                    alert('Please fill in all fields');
                    return;
                }
                
                try {
                    loginButton.disabled = true;
                    loginButton.textContent = 'Signing in...';
                    
                    // Sign in with Supabase
                    const { data, error } = await supabaseClient.auth.signInWithPassword({
                        email,
                        password
                    });
                    
                    if (error) throw error;
                    
                    // Successful login
                    console.log('User signed in:', data.user);
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    console.error('Error signing in:', error);
                    
                    if (error.message.includes('Invalid login')) {
                        alert('Invalid email or password');
                    } else {
                        alert('Error signing in: ' + error.message);
                    }
                } finally {
                    loginButton.disabled = false;
                    loginButton.textContent = 'Sign In';
                }
            });
            
            // Google Sign In handler
            const googleButton = loginForm.querySelector('.google-btn');
            if (googleButton) {
                googleButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    
                    try {
                        // Sign in with Google using Supabase
                        const { data, error } = await supabaseClient.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                                redirectTo: `${window.location.origin}/dashboard.html`
                            }
                        });
                        
                        if (error) throw error;
                        
                        // The page will be redirected to Google's OAuth flow
                        console.log('Redirecting to Google auth...');
                    } catch (error) {
                        console.error('Error signing in with Google:', error);
                        alert('Error signing in with Google: ' + error.message);
                    }
                });
            }
        }
        
        // Registration page functionality
        if (isRegisterPage) {
            console.log('Initializing registration page...');
            const registerForm = document.getElementById('register-form');
            const registerButton = registerForm.querySelector('.btn-primary');
            
            registerButton.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('Register button clicked');
                
                const username = registerForm.querySelector('input[type="text"]').value;
                const email = registerForm.querySelector('input[type="email"]').value;
                const password = registerForm.querySelector('input[type="password"]').value;
                const dob = registerForm.querySelector('input[type="date"]').value;
                
                console.log('Form values:', { username, email, dob });
                
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
                
                try {
                    console.log('Starting registration process...');
                    registerButton.disabled = true;
                    registerButton.textContent = 'Creating account...';
                    
                    // Create user with Supabase
                    console.log('Creating user with Supabase...');
                    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                username,
                                dob: birthDate.toISOString(),
                                full_name: username
                            }
                        }
                    });
                    
                    if (authError) {
                        console.error('Auth error:', authError);
                        throw authError;
                    }
                    
                    console.log('User created:', authData);
                    
                    // Insert additional user info into profiles table
                    console.log('Creating user profile...');
                    const { error: profileError } = await supabaseClient
                        .from('profiles')
                        .insert({
                            id: authData.user.id,
                            username,
                            date_of_birth: birthDate.toISOString(),
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    
                    if (profileError) {
                        console.error('Profile error:', profileError);
                        // If profile creation fails, we should still allow the user to proceed
                        // as they can complete their profile later
                        console.warn('Profile creation failed, but user account was created');
                    }
                    
                    console.log('Registration successful!');
                    alert('Registration successful! Please check your email for a verification link. After verifying your email, you can sign in.');
                    
                    // Sign out as Supabase auto-signs in the user
                    await supabaseClient.auth.signOut();
                    window.location.href = 'login.html';
                } catch (error) {
                    console.error('Error creating user:', error);
                    
                    let errorMessage = 'Error creating account. Please try again.';
                    
                    if (error.message) {
                        if (error.message.includes('already registered')) {
                            errorMessage = 'Email already in use';
                        } else if (error.message.includes('weak password')) {
                            errorMessage = 'Password is too weak. Use at least 6 characters.';
                        } else if (error.message.includes('profiles')) {
                            errorMessage = 'Account created but profile setup failed. Please try logging in.';
                        } else {
                            errorMessage = 'Error creating account: ' + error.message;
                        }
                    }
                    
                    alert(errorMessage);
                } finally {
                    registerButton.disabled = false;
                    registerButton.textContent = 'Sign Up';
                }
            });
            
            // Google Sign In handler for registration
            const googleButton = registerForm.querySelector('.google-btn');
            if (googleButton) {
                googleButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    
                    try {
                        // Sign in with Google using Supabase
                        const { data, error } = await supabaseClient.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                                redirectTo: `${window.location.origin}/dashboard.html`
                            }
                        });
                        
                        if (error) throw error;
                        
                        // The page will be redirected to Google's OAuth flow
                        console.log('Redirecting to Google auth...');
                    } catch (error) {
                        console.error('Error signing up with Google:', error);
                        alert('Error signing up with Google: ' + error.message);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error initializing auth:', error);
        alert('Error initializing authentication. Please refresh the page.');
    }
}); 