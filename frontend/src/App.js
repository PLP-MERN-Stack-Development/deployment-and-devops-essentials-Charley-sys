import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [health, setHealth] = useState(null);
  const [equipment, setEquipment] = useState([]);
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
      setError('Failed to connect to medical equipment monitoring server');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${API_URL}/api/equipment`);
      const data = await response.json();
      setEquipment(data.equipment || []);
    } catch (err) {
      console.error('Failed to fetch equipment data');
    }
  };

  useEffect(() => {
    checkHealth();
    fetchEquipment();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>BioMed Equipment Monitoring System</h1>
          <p>Real-time Medical Equipment Management & Monitoring</p>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <h2>🩺 System Health Status</h2>
          {loading && <p>Monitoring system health...</p>}
          {error && (
            <div style={{ color: '#e74c3c' }}>
              <p>{error}</p>
              <button onClick={checkHealth}>Retry Connection</button>
            </div>
          )}
          {health && (
            <div style={{ color: '#27ae60' }}>
              <p>✅ Monitoring System Operational</p>
              <p><strong>System Status:</strong> {health.status}</p>
              <p><strong>Message:</strong> {health.message}</p>
              <p><strong>Environment:</strong> {health.environment}</p>
              <p><strong>Last Update:</strong> {new Date(health.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2>🏥 Medical Equipment Status</h2>
          {equipment.length > 0 ? (
            <div className="equipment-grid">
              {equipment.map(item => (
                <div key={item.id} className="equipment-item">
                  <h3>{item.name}</h3>
                  <p><strong>Status:</strong> 
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </p>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Last Maintenance:</strong> {item.lastMaintenance}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#f39c12' }}>
              <p>⚠️ No equipment data available</p>
              <button onClick={fetchEquipment}>Refresh Equipment Data</button>
            </div>
          )}
        </div>

        <div className="card">
          <h2>📊 System Overview</h2>
          <div className="status-grid">
            <div className="status-item">
              <h3>Monitoring Systems</h3>
              <ul>
                <li>✅ Patient Monitoring Equipment</li>
                <li>✅ Diagnostic Imaging Systems</li>
                <li>✅ Life Support Devices</li>
                <li>✅ Surgical Instruments</li>
              </ul>
            </div>
            <div className="status-item">
              <h3>Infrastructure</h3>
              <ul>
                <li>✅ Real-time Data Processing</li>
                <li>✅ Secure Data Transmission</li>
                <li>✅ Automated Alerts</li>
                <li>✅ Maintenance Scheduling</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>🔧 Deployment Status</h2>
          <p>Biomedical Equipment Monitoring Platform - Production Ready</p>
          <ul>
            <li>✅ Cloud Infrastructure Deployed</li>
            <li>✅ Real-time Monitoring Active</li>
            <li>✅ Data Backup Systems Online</li>
            <li>✅ Security Protocols Enabled</li>
            <li>✅ Compliance Standards Met</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;