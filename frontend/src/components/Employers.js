import React, { useState } from 'react';
import { api } from '../services/api';

const Employers = ({ employers, setEmployers, onDataUpdate }) => {
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  const resetForm = () => {
    setNome('');
    setCargo('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setStatus({ type: 'error', message: 'Informe o nome do funcionário.' });
      return;
    }

    try {
      const payload = { nome_Funcionario: nome, cargo_Funcionario: cargo };

      if (editingId) {
        await api.updateEmployer(editingId, payload);
        setStatus({ type: 'success', message: 'Funcionário atualizado.' });
      } else {
        const created = await api.createEmployer(payload);
        setStatus({ type: 'success', message: 'Funcionário criado.' });
        if (typeof onDataUpdate === 'function') {
          await onDataUpdate();
        } else if (typeof setEmployers === 'function') {
          setEmployers(prev => [...prev, created]);
        }
      }

      if (editingId && typeof onDataUpdate !== 'function' && typeof setEmployers === 'function') {
        setEmployers(prev => prev.map(e => (e.id === editingId ? { ...e, ...payload } : e)));
      }

      resetForm();
    } catch (err) {
      console.error('Erro salvando funcionário:', err);
      setStatus({ type: 'error', message: 'Erro ao salvar funcionário.' });
    }
  };

  const handleEdit = (employer) => {
    setNome(employer.nome_Funcionario || '');
    setCargo(employer.cargo_Funcionario || '');
    setEditingId(employer.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;
    try {
      await api.deleteEmployer(id);
      setStatus({ type: 'success', message: 'Funcionário excluído.' });
      if (typeof onDataUpdate === 'function') {
        await onDataUpdate();
      } else if (typeof setEmployers === 'function') {
        setEmployers(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error('Erro excluindo funcionário:', err);
      setStatus({ type: 'error', message: 'Erro ao excluir funcionário.' });
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Funcionários</h2>
        <div className="actions">
          <button className="btn btn-primary" onClick={resetForm}>Novo Funcionário</button>
        </div>
      </div>

      {status.message && (
        <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-2">
        <div>
          <form onSubmit={handleSubmit} className="card">
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
            </div>

            <div className="form-group">
              <label className="form-label">Cargo</label>
              <input className="form-input" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo" />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">{editingId ? 'Salvar' : 'Adicionar Funcionário'}</button>
              {editingId && <button type="button" className="btn btn-danger" onClick={resetForm}>Cancelar</button>}
            </div>
          </form>
        </div>

        <div>
          <div className="table-container">
            {(!employers || employers.length === 0) ? (
              <div className="empty-state">
                <div className="empty-state-icon">🧑‍🎤</div>
                <div>Nenhum funcionário encontrado. Adicione novos funcionários pelo formulário.</div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.nome_Funcionario}</td>
                      <td>{emp.cargo_Funcionario}</td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEdit(emp)}>Editar</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employers;
