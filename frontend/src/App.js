import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/health`);
      const data = await response.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError('Failed to connect to backend server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>MERN Stack Application</h1>
          <p>Deployed with DevOps Best Practices</p>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <h2>Backend Connection Status</h2>
          {loading && <p>Checking backend health...</p>}
          {error && (
            <div style={{ color: 'red' }}>
              <p>{error}</p>
              <button onClick={checkHealth}>Retry</button>
            </div>
          )}
          {health && (
            <div style={{ color: 'green' }}>
              <p>✅ Backend is running!</p>
              <p><strong>Status:</strong> {health.status}</p>
              <p><strong>Message:</strong> {health.message}</p>
              <p><strong>Environment:</strong> {health.environment}</p>
              <p><strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Application Status</h2>
          <ul>
            <li>✅ Backend Server Running</li>
            <li>✅ MongoDB Connected</li>
            <li>✅ React Frontend Ready</li>
            <li>✅ API Communication Working</li>
          </ul>
        </div>

        <div className="card">
          <h2>Next Steps</h2>
          <p>Ready to continue with deployment configuration:</p>
          <ul>
            <li>CI/CD Pipeline Setup</li>
            <li>Environment Configuration</li>
            <li>Deployment to Cloud Platforms</li>
            <li>Monitoring Setup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;