import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Modal form states
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Set default auth header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (username, email, password, role = 'user') => {
    try {
      const response = await axios.post('/api/users/signup', { username, email, password, role });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      if (isSignupMode) {
        await signup(username, email, password, 'user');
      } else {
        await login(email, password);
      }
      setShowLoginModal(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setIsSignupMode(false);
    } catch (err) {
      const defaultMsg = isSignupMode ? 'Signup failed. Please try again.' : 'Invalid email or password. Please try again.';
      setLoginError(err.response?.data?.message || err.response?.data?.error || defaultMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, setShowLoginModal, setIsSignupMode }}>
      {children}
      
      {/* Global Login Modal for Guests */}
      {showLoginModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '568px', maxWidth: '100%', maxHeight: '100%', overflowY: 'auto', boxShadow: '0 8px 28px rgba(0,0,0,0.28)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', minHeight: '64px', borderBottom: '1px solid #ebebeb' }}>
              <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', left: '24px', border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f7f7f7'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: '3', overflow: 'visible' }}><path d="m6 6 20 20M26 6 6 26"></path></svg>
              </button>
              <h1 style={{ m: 0, fontSize: '16px', fontWeight: '800', color: '#222222', margin: 0 }}>Log in or sign up</h1>
            </div>
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#222222', marginBottom: '24px', marginTop: '8px' }}>Welcome to Airbnb</h2>
              
              <form onSubmit={handleModalSubmit}>
                <div style={{ border: '1px solid #b0b0b0', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  {isSignupMode && (
                    <div style={{ borderBottom: '1px solid #b0b0b0' }}>
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '18px 14px', fontSize: '16px', border: 'none', outline: 'none', boxSizing: 'border-box', backgroundColor: 'transparent' }}
                      />
                    </div>
                  )}
                  
                  <div style={{ borderBottom: '1px solid #b0b0b0' }}>
                    <input 
                      type="email" 
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '18px 14px', fontSize: '16px', border: 'none', outline: 'none', boxSizing: 'border-box', backgroundColor: 'transparent' }}
                    />
                  </div>

                  <div>
                    <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '18px 14px', fontSize: '16px', border: 'none', outline: 'none', boxSizing: 'border-box', backgroundColor: 'transparent' }}
                    />
                  </div>
                </div>

                {loginError && <div style={{ color: '#c13515', fontSize: '14px', marginBottom: '20px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff8f6', padding: '12px', border: '1px solid #ffdbd2', borderRadius: '8px' }}>
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '18px', width: '18px', fill: 'currentcolor' }}><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 1-12 12z"></path><path d="M16 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM15 16h2v8h-2z"></path></svg>
                  <span>{loginError}</span>
                </div>}

                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  style={{ width: '100%', padding: '14px', fontSize: '16px', background: 'linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: isLoggingIn ? 'not-allowed' : 'pointer', opacity: isLoggingIn ? 0.7 : 1, transition: 'opacity 0.2s', boxSizing: 'border-box', marginBottom: '24px' }}
                  onMouseOver={(e) => !isLoggingIn && (e.target.style.opacity = 0.9)} 
                  onMouseOut={(e) => !isLoggingIn && (e.target.style.opacity = 1)}
                >
                  {isLoggingIn ? (isSignupMode ? 'Signing up...' : 'Logging in...') : (isSignupMode ? 'Sign up' : 'Log in')}
                </button>
                
                <div style={{ textAlign: 'center', fontSize: '14px', color: '#222222' }}>
                  {isSignupMode ? (
                    <>Already have an account? <span onClick={() => setIsSignupMode(false)} style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>Log in</span></>
                  ) : (
                    <>Don't have an account? <span onClick={() => setIsSignupMode(true)} style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer' }}>Sign up</span></>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
