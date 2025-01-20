import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from './firebase';
import { loginSuccess, logout } from './store/slices/authSlice';
import { Layout } from 'antd';
import Login from './components/auth/login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/routes/ProtectedRoute';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const { Content } = Layout;

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence);

    // Check localStorage first
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser)));
    }

    // Then listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          const userData = {
            user: {
              email: user.email,
              uid: user.uid
            },
            token
          };
          dispatch(loginSuccess(userData));
          localStorage.setItem('authUser', JSON.stringify(userData));
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      } else {
        dispatch(logout());
        localStorage.removeItem('authUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
        <Content>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;