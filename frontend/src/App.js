// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Schedule from './components/Schedule';
import Employers from './components/Employers';
import { api } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados da API
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [clientsData, schedulesData, employersData] = await Promise.all([
        api.getClients(),
        api.getSchedules(),
        api.getEmployers()
      ]);
      
      setClients(clientsData);
      setSchedules(schedulesData);
      setEmployers(employersData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard clients={clients} schedules={schedules} employers={employers} />;
      case 'clients':
        return (
          <Clients 
            clients={clients} 
            setClients={setClients}
            onDataUpdate={loadAllData}
          />
        );
      case 'schedule':
        return (
          <Schedule 
            schedules={schedules} 
            setSchedules={setSchedules}
            clients={clients} 
            employers={employers}
            onDataUpdate={loadAllData}
          />
        );
      case 'employers':
        return (
          <Employers 
            employers={employers} 
            setEmployers={setEmployers}
            onDataUpdate={loadAllData}
          />
        );
      default:
        return <Dashboard clients={clients} schedules={schedules} employers={employers} />;
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
