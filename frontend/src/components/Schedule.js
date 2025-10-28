import React from 'react';

const Schedule = ({ schedules }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Schedule</h2>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client ID</th>
              <th>Employer ID</th>
              <th>Service</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.id_Cliente}</td>
                <td>{schedule.id_Funcionario}</td>
                <td>{schedule.servico}</td>
                <td>{new Date(schedule.data_Agendamento).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
