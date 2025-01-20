import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../firebase';
import { loginSuccess } from '../../store/slices/authSlice';
import './login.css';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Set persistence before sign in
      await setPersistence(auth, browserLocalPersistence);
      
      const email = e.target.email.value;
      const password = e.target.password.value;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      const userData = {
        user: {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          displayName: userCredential.user.displayName
        },
        token
      };

      localStorage.setItem('authUser', JSON.stringify(userData));
      dispatch(loginSuccess(userData));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/wrong-password' ? 'Incorrect password' :
        error.code === 'auth/user-not-found' ? 'Email not found' :
        'Failed to sign in'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestUser = async () => {
    try {
      const testEmail = "test@example.com";
      const testPassword = "password123";
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        testEmail,
        testPassword
      );
      
      console.log("Test user created:", userCredential.user);
      alert("Test user created. Email: test@example.com, Password: password123");
    } catch (error) {
      console.error("Error creating test user:", error);
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image"></div>
        <div className="login-form">
          <h1 className="login-title">Welcome Back</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>

          {process.env.NODE_ENV === 'development' && (
            <Button 
              variant="secondary" 
              onClick={handleCreateTestUser}
              className="mt-3 w-100"
            >
              Create Test User
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;