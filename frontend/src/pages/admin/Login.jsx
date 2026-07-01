import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const Login = () => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    if (!email || !password || (isSignupMode && !username)) {
      setIsLoggingIn(false);
      return setError('Please enter all required fields');
    }

    try {
      if (isSignupMode) {
        await signup(username, email, password, 'admin');
      } else {
        await login(email, password);
      }
      navigate('/host/dashboard');
    } catch (err) {
      const defaultMsg = isSignupMode ? 'Signup failed. Please try again.' : 'Invalid email or password. Please try again.';
      setError(err.response?.data?.message || err.response?.data?.error || defaultMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)', backgroundColor: 'var(--background-light)' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '24px' }}>
            {isSignupMode ? 'Host Sign up' : 'Host Login'}
          </h2>
        
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isSignupMode && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>Full Name</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
            {isSignupMode ? 'Sign up' : 'Log in'}
          </button>
          
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#717171' }}>
            {isSignupMode ? 'Already have a host account? ' : "Don't have a host account yet? "}
            <button 
              type="button" 
              onClick={() => {
                setIsSignupMode(!isSignupMode);
                setError('');
              }} 
              style={{ background: 'none', border: 'none', color: '#222222', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
            >
              {isSignupMode ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
