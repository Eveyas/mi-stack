import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

function Dashboard({ leadData, onBack }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLead, setNewLead] = useState(leadData || { name: '', email: '', phone: '' });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/leads`);
        setLeads(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error cargando leads');
        setLoading(false);
        console.error('Error fetching leads:', err);
      }
    };

    fetchLeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/leads`, newLead);
      setLeads([response.data, ...leads]);
      setNewLead({ name: '', email: '', phone: '' });
      setError(null);
    } catch (err) {
      setError('Error creando lead: ' + (err.response?.data?.error || ''));
      console.error('Error creating lead:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">Cargando leads...</div>;
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Panel de Administración</h1>
          <button onClick={onBack} className="back-btn">
            Volver al Sitio Principal
          </button>
        </div>
      </header>

      <div className="container">
        <div className="dashboard-content">
          {leadData && (
            <div className="lead-confirmation">
              <h2>¡Gracias por registrarte, pronto nos pondremos en contacto contigo {leadData.name}!</h2>
              <p>Email: {leadData.email} | Teléfono: {leadData.phone || 'N/A'}</p>
            </div>
          )}

          {/* <div className="lead-form-section">
            <h2>Agregar nuevo lead</h2>
            <form onSubmit={handleSubmit} className="lead-form">
              <div className="form-group">
                <label>Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  value={newLead.name}
                  onChange={handleChange}
                  required
                  placeholder="Nombre completo"
                />
              </div>
              
              <div className="form-group">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={newLead.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>
              
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={newLead.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                />
              </div>
              
              <button type="submit" className="submit-btn">
                Guardar Lead
              </button>
            </form> */}

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="leads-list">
            <h2>Leads registrados ({leads.length})</h2>
            {leads.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td>{lead.id}</td>
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone || 'N/A'}</td>
                        <td>
                          {new Date(lead.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay leads registrados</p>
            )}
          </div>
        </div>
      </div>
    // </div>
  );
}

export default Dashboard;
