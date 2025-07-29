import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3268';

function LandingPage({ onNavigateToDashboard }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(`${API_BASE_URL}/leads`, formData);
      setShowSuccessModal(true);
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      setError('Error enviando tu información: ' + (err.response?.data?.error || ''));
      console.error('Error creating lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="landing-page">
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>¡Gracias por contactarnos, {formData.name}!</h2>
            <p>Tu información ha sido enviada con éxito.</p>
            <p>Nos pondremos en contacto contigo pronto.</p>
            <button onClick={closeModal} className="modal-close-btn">
              Cerrar
            </button>
          </div>
        </div>
      )}

      <header className="hero">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>High Rank</h1>
              <p>Soluciones innovadoras para empresas visionarias</p>
            </div>
            <button 
              className="dashboard-btn submit"
              onClick={onNavigateToDashboard}
            >
            </button>
          </div>
        </div>
      </header>

      <section className="about-section">
        <div className="container">
          <h2>Sobre Nosotros</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Nuestra Misión</h3>
              <p>
                Ayudamos a empresas a transformar sus operaciones mediante soluciones tecnológicas 
                innovadoras. Con más de 10 años de experiencia, hemos ayudado a más de 500 empresas 
                a alcanzar sus objetivos
              </p>
              
              <h3>Nuestro Equipo</h3>
              <p>
                Contamos con un equipo multidisciplinario de expertos en tecnología, negocios 
                y experiencia de usuario. Nos apasiona crear soluciones que generen un impacto real
              </p>
              
              <h3>Nuestros Valores</h3>
              <ul>
                <li>Innovación constante</li>
                <li>Compromiso con la excelencia</li>
                <li>Transparencia en todas nuestras acciones</li>
                <li>Orientación al cliente</li>
              </ul>
            </div>
            <div className="about-image">
              <img src={require('./Nosotros.jpg')} alt="Imagen de nuestro equipo" style={{ width: '100%', borderRadius: '12px' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container form-container">
          <div className="form-header">
            <h2>¿Listo para comenzar?</h2>
            <p>Contesta el formulario y nos pondremos en contacto contigo</p>
          </div>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nombre"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="user@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(998) 123-456"
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar información'}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025. High Rank. Todos los derechos reservados. Laines Cupul Evelin Yasmin</p>
          <div className="footer-links">
            <a href="#">Términos y Condiciones</a>
            {/* <a href="#">Política de Privacidad</a> */}
            <a href="#">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
