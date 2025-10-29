import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Clients = ({ clients, setClients, onDataUpdate }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!clients || clients.length === 0) return;
  }, [clients]);

  const resetForm = () => {
    setNome('');
    setTelefone('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      setStatus({ type: 'error', message: 'Informe o nome do cliente.' });
      return;
    }

    try {
      const payload = { nome_Cliente: nome, telefone_Celular: telefone };

      if (editingId) {
        await api.updateClient(editingId, payload);
        setStatus({ type: 'success', message: 'Cliente atualizado.' });
      } else {
        const created = await api.createClient(payload);
        setStatus({ type: 'success', message: 'Cliente criado.' });
        if (typeof onDataUpdate === 'function') {
          await onDataUpdate();
        } else if (typeof setClients === 'function') {
          setClients(prev => [...prev, created]);
        }
      }

      // if updated with onDataUpdate, that function will refresh list; otherwise update locally
      if (editingId && typeof onDataUpdate !== 'function' && typeof setClients === 'function') {
        setClients(prev => prev.map(c => (c.id === editingId ? { ...c, ...payload } : c)));
      }

      resetForm();
    } catch (err) {
      console.error('Erro salvando cliente:', err);
      setStatus({ type: 'error', message: 'Erro ao salvar cliente.' });
    }
  };

  const handleEdit = (client) => {
    setNome(client.nome_Cliente || '');
    setTelefone(client.telefone_Celular || '');
    setEditingId(client.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await api.deleteClient(id);
      setStatus({ type: 'success', message: 'Cliente excluído.' });
      if (typeof onDataUpdate === 'function') {
        await onDataUpdate();
      } else if (typeof setClients === 'function') {
        setClients(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Erro excluindo cliente:', err);
      setStatus({ type: 'error', message: 'Erro ao excluir cliente.' });
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Clientes</h2>
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
              <input
                className="form-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                className="form-input"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(xx) xxxxx-xxxx"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">
                {editingId ? 'Salvar alterações' : 'Adicionar Cliente'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-danger" onClick={() => resetForm()}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <div className="table-container">
            {(!clients || clients.length === 0) ? (
              <div className="empty-state">
                <div className="empty-state-icon">🧾</div>
                <div>Nenhum cliente encontrado. Adicione novos clientes pelo formulário.</div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>{client.nome_Cliente}</td>
                      <td>{client.telefone_Celular}</td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEdit(client)}>Editar</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(client.id)}>Excluir</button>
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

export default Clients;
