'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import './auth-styles.css';

export default function AuthPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router, supabase]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: target.email.value,
        password: target.password.value,
      });
      
      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      // You could show an error message here
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      email: { value: string };
      password: { value: string };
    };
    
    try {
      const { error } = await supabase.auth.signUp({
        email: target.email.value,
        password: target.password.value,
        options: {
          data: {
            full_name: target.name.value,
          },
        },
      });
      
      if (error) throw error;
      // You could show a success message here
      setIsSignUpMode(false); // Switch back to sign in mode
    } catch (error) {
      console.error('Error signing up:', error);
      // You could show an error message here
    }
  };

  return (
    <div className={`auth-container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form className="sign-in-form" onSubmit={handleSignIn}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" name="email" placeholder="Email" required />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="password" placeholder="Password" required />
            </div>
            <button type="submit" className="btn solid">Login</button>
            
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-apple"></i>
              </a>
            </div>
          </form>

          {/* Sign Up Form */}
          <form className="sign-up-form" onSubmit={handleSignUp}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" name="name" placeholder="Full Name" required />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" name="email" placeholder="Email" required />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="password" placeholder="Password" required />
            </div>
            <button type="submit" className="btn">Sign up</button>
            
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-apple"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New to Poold?</h3>
            <p>
              Join poold to split subscriptions with friends automatically. Sign up to get started!
            </p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(true)}>
              Sign up
            </button>
          </div>
          <img src="/img/signin.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Already a member?</h3>
            <p>
              Sign in to manage your shared subscriptions and groups. Welcome back!
            </p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(false)}>
              Sign in
            </button>
          </div>
          <img src="/img/signup.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
} 