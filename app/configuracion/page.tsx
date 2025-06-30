'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '../components/NotificationContext';

interface BusinessSettings {
  id: number;
  nombreNegocio: string;
  direccion: string;
  telefono: string;
  emailContacto: string;
  horarioApertura: string;
  horarioCierre: string;
}

const ConfiguracionPage = () => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();
        setSettings(data);
      } catch (error: any) {
        showNotification(`Error al cargar la configuración: ${error.message}`, 'danger');
      }
    };
    fetchSettings();
  }, [showNotification]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings!,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      showNotification('Configuración guardada exitosamente!', 'success');
    } catch (error: any) {
      showNotification(`Error al guardar la configuración: ${error.message}`, 'danger');
    }
  };

  if (!settings) {
    return <div className="container py-4">Cargando configuración...</div>;
  }

  return (
    <div className="container py-4">
      <h1>Configuración del Negocio</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombreNegocio" className="form-label">Nombre del Negocio</label>
          <input
            type="text"
            className="form-control"
            id="nombreNegocio"
            value={settings.nombreNegocio || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            value={settings.direccion || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="text"
            className="form-control"
            id="telefono"
            value={settings.telefono || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="emailContacto" className="form-label">Email de Contacto</label>
          <input
            type="email"
            className="form-control"
            id="emailContacto"
            value={settings.emailContacto || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="horarioApertura" className="form-label">Horario de Apertura</label>
          <input
            type="time"
            className="form-control"
            id="horarioApertura"
            value={settings.horarioApertura || ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="horarioCierre" className="form-label">Horario de Cierre</label>
          <input
            type="time"
            className="form-control"
            id="horarioCierre"
            value={settings.horarioCierre || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Configuración</button>
      </form>
    </div>
  );
};

export default ConfiguracionPage;