import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          <li 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={`nav-item ${currentView === 'clients' ? 'active' : ''}`} 
            onClick={() => setCurrentView('clients')}
          >
            Clients
          </li>
          <li 
            className={`nav-item ${currentView === 'schedule' ? 'active' : ''}`} 
            onClick={() => setCurrentView('schedule')}
          >
            Schedule
          </li>
          <li 
            className={`nav-item ${currentView === 'employers' ? 'active' : ''}`} 
            onClick={() => setCurrentView('employers')}
          >
            Employers
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
