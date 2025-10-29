import React, { useState } from 'react';
import { api } from '../services/api';

const Schedule = ({ schedules, clients = [], employers = [], onDataUpdate }) => {
  // Lista de serviços (pode ser expandida conforme necessidade)
  const services = [
    'Corte de Cabelo',
    'Barba',
    'Corte + Barba',
    'Sobrancelha',
    'Corte Infantil',
    'Lavagem'
  ];

  const [form, setForm] = useState({
    id_Cliente: clients.length ? clients[0].id : '',
    id_Funcionario: employers.length ? employers[0].id : '',
    servico: services[0] || '',
    data_Agendamento: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateDate = (dateStr) => {
    const selectedDate = new Date(dateStr);
    const now = new Date();
    return selectedDate > now;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateDate(form.data_Agendamento)) {
      setError('A data do agendamento deve ser futura');
      setLoading(false);
      return;
    }

    try {
      // Ensure proper types
      const payload = {
        id_Cliente: Number(form.id_Cliente),
        id_Funcionario: Number(form.id_Funcionario),
        servico: form.servico,
        data_Agendamento: form.data_Agendamento
      };

      await api.createSchedule(payload);
      // refresh data in parent
      if (onDataUpdate) await onDataUpdate();
      // clear form
      setForm(prev => ({ ...prev, servico: '', data_Agendamento: '' }));
      setSuccess('Agendamento criado com sucesso!');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title">Agendamentos</h2>
        <button
          onClick={onDataUpdate}
          className="btn btn-ghost"
          style={{ marginLeft: '1rem' }}
        >
          Atualizar Lista
        </button>
      </div>

      <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cliente:</label>
              <select
                className="form-select"
                name="id_Cliente"
                value={form.id_Cliente}
                onChange={handleChange}
                required
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nome_Cliente || c.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Funcionário:</label>
              <select
                className="form-select"
                name="id_Funcionario"
                value={form.id_Funcionario}
                onChange={handleChange}
                required
              >
                {employers.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nome_Funcionario || emp.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Serviço:</label>
              <select
                className="form-select"
                name="servico"
                value={form.servico}
                onChange={handleChange}
                required
              >
                {services.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Data e Hora:</label>
              <input
                className="form-input"
                name="data_Agendamento"
                value={form.data_Agendamento}
                onChange={handleChange}
                type="datetime-local"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Salvando...' : 'Agendar'}
            </button>
          </div>
        </form>
        {error && <div className="status-message status-error" style={{ marginTop: '1rem' }}>{error}</div>}
        {success && <div className="status-message status-success" style={{ marginTop: '1rem' }}>{success}</div>}
      </div>

      <div className="table-container" style={{ padding: '1rem' }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Funcionário</th>
              <th>Serviço</th>
              <th>Data e Hora</th>
            </tr>
          </thead>
          <tbody>
            {(!schedules || schedules.length === 0) ? (
              <tr>
                <td colSpan={5} className="empty-state" style={{ padding: '2rem' }}>
                  Nenhum agendamento encontrado.
                </td>
              </tr>
            ) : (
              schedules.map(schedule => (
                <tr key={schedule.id}>
                  <td>{schedule.id}</td>
                  <td>{schedule.clientName || schedule.nome_Cliente || schedule.id_Cliente}</td>
                  <td>{schedule.employerName || schedule.nome_Funcionario || schedule.id_Funcionario}</td>
                  <td>{schedule.servico}</td>
                  <td>{new Date(schedule.dataAgendamento || schedule.data_Agendamento).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;
