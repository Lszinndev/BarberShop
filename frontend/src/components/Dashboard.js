import React from 'react';

const Dashboard = ({ clients, schedules, employers }) => {
  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Dashboard</h1>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{clients.length}</div>
          <div className="stat-label">Clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{schedules.length}</div>
          <div className="stat-label">Schedules</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{employers.length}</div>
          <div className="stat-label">Employers</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
