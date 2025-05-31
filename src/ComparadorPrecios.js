import React, { useState, useEffect } from 'react';
import medicamentosData from './medicamentos.json';
import { useNavigate, useLocation } from 'react-router-dom';
import './ComparadorPrecios.css';

const ComparadorPrecios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery); // Inicializar con la búsqueda recibida
  const origin = location.state?.from || 'home';

  // Sincronizar el término de búsqueda cuando llega nueva prop
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const handleGoBack = () => {
    navigate(origin === 'dashboard' ? '/dashboard' : '/');
  };

  const [medicamentos, setMedicamentos] = useState([]);

  useEffect(() => {
    setMedicamentos(medicamentosData);
  }, []);

  const cleanPrice = (price) => {
    if (price === "-" || price === "") return null;
    return Number(price.replace("$", "").replace(" MXN", "").trim());
  }; 

  const filteredMedicamentos = medicamentos.filter(med => 
    med["Nombre del Producto"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="comparador-container">
      <div className="header-comparador">
        <button 
          onClick={handleGoBack}
          className="back-button"
        >
          ← Regresar {origin === 'dashboard' ? 'al Dashboard' : 'al Inicio'}
        </button>
      </div>

      <h1>Comparador de Precios de Medicamentos</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por nombre de medicamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMedicamentos.length > 0 ? (
        <div className="price-table-container">
          <table className="price-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Tipo</th>
                <th>Concentración</th>
                <th>Presentación</th>
                <th>Guadalajara</th>
                <th>Ahorro</th>
                <th>Benavides</th>
                <th>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicamentos.map((med, index) => {
                const precios = {
                  Guadalajara: cleanPrice(med["Precio Guadalajara (Aprox.)"]),
                  Ahorro: cleanPrice(med["Precio Ahorro (Aprox.)"]),
                  Benavides: cleanPrice(med["Precio Benavides (Aprox.)"]),
                  Promedio: cleanPrice(med["Precio Promedio (Aprox.)"])
                };

                return (
                  <tr key={index}>
                    <td>{med["Nombre del Producto"]}</td>
                    <td>{med["Tipo de Medicamento"]}</td>
                    <td>{med["Concentracion"]}</td>
                    <td>{med["Presentacion"]}</td>
                    {Object.values(precios).map((precio, i) => (
                      <td key={i}>
                        {precio ? 
                          `$${precio.toLocaleString('es-MX', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}` : 
                          "No disponible"}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-results">
          {searchTerm ? 
            `No se encontraron resultados para "${searchTerm}"` : 
            "Ingrese un medicamento para buscar"}
        </p>
      )}
    </div>
  );
};

export default ComparadorPrecios;