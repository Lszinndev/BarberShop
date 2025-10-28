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
            Painel
          </li>
          <li 
            className={`nav-item ${currentView === 'clients' ? 'active' : ''}`} 
            onClick={() => setCurrentView('clients')}
          >
            Clientes
          </li>
          <li 
            className={`nav-item ${currentView === 'schedule' ? 'active' : ''}`} 
            onClick={() => setCurrentView('schedule')}
          >
            Agendamentos
          </li>
          <li 
            className={`nav-item ${currentView === 'employers' ? 'active' : ''}`} 
            onClick={() => setCurrentView('employers')}
          >
            Funcionários
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
