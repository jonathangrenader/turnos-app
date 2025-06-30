
import React, { useState, useEffect } from 'react';
import { Servicio } from '../models/Servicio';
import { ComisionEmpleadoServicio } from '../models/ComisionEmpleadoServicio';
import { Empleado } from '../models/Empleado';
import { useNotification } from './NotificationContext';

interface ServicioFormProps {
  servicio?: Servicio;
  onSave: (servicio: Servicio) => void;
  onCancel: () => void;
}

const ServicioForm: React.FC<ServicioFormProps> = ({ servicio, onSave, onCancel }) => {
  const [nombre, setNombre] = useState(servicio?.nombre || '');
  const [duracion, setDuracion] = useState(servicio?.duracion || 0);
  const [precio, setPrecio] = useState(servicio?.precio || 0);
  const [comisionPorcentaje, setComisionPorcentaje] = useState(servicio?.comisionPorcentaje || 0);
  const [comisiones, setComisiones] = useState<ComisionEmpleadoServicio[]>(servicio?.comisiones || []);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (servicio) {
      setNombre(servicio.nombre);
      setDuracion(servicio.duracion);
      setPrecio(servicio.precio);
      setComisionPorcentaje(servicio.comisionPorcentaje || 0);
      setComisiones(servicio.comisiones || []);
    } else {
      setNombre('');
      setDuracion(0);
      setPrecio(0);
      setComisionPorcentaje(0);
      setComisiones([]);
    }
  }, [servicio]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const res = await fetch('/api/empleados');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmpleados(data);
      } catch (error: any) {
        showNotification(`Error al cargar empleados: ${error.message}`, 'danger');
      }
    };
    fetchEmpleados();
  }, [showNotification]);

  const handleAddComision = () => {
    setComisiones([...comisiones, { id: Date.now(), empleadoId: 0, servicioId: servicio?.id || 0, porcentajeComision: 0 }]);
  };

  const handleComisionChange = (index: number, field: keyof ComisionEmpleadoServicio, value: string | number) => {
    const newComisiones = [...comisiones];
    // Ensure the id is not changed if it's an existing record
    if (field === 'id') {
        // Do nothing, id should not be changed by user input
    } else {
        (newComisiones[index] as any)[field] = value;
    }
    setComisiones(newComisiones);
  };

  const handleRemoveComision = (index: number) => {
    const newComisiones = comisiones.filter((_, i) => i !== index);
    setComisiones(newComisiones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newServicio: Servicio = {
      id: servicio?.id, // Keep existing ID for updates
      nombre,
      duracion: Number(duracion),
      precio: Number(precio),
      comisionPorcentaje: Number(comisionPorcentaje),
      comisiones: comisiones.map(c => ({
        ...c,
        id: c.id < 1000000000000 ? undefined : c.id, // Remove temporary IDs for new entries, keep existing ones
        servicioId: undefined // servicioId is set by the API
      })),
    };
    onSave(newServicio);
    showNotification('Servicio guardado exitosamente!', 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="duracion" className="form-label">Duración (minutos)</label>
        <input
          type="number"
          className="form-control"
          id="duracion"
          value={duracion}
          onChange={(e) => setDuracion(Number(e.target.value))}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="precio" className="form-label">Precio</label>
        <input
          type="number"
          className="form-control"
          id="precio"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="comisionPorcentaje" className="form-label">Porcentaje de Comisión (ej. 0.10 para 10%)</label>
        <input
          type="number"
          className="form-control"
          id="comisionPorcentaje"
          value={comisionPorcentaje}
          onChange={(e) => setComisionPorcentaje(Number(e.target.value))}
          step="0.01"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Comisiones por Empleado</label>
        {comisiones.map((comision, index) => (
          <div key={comision.id || index} className="row mb-2 align-items-end">
            <div className="col-md-5">
              <label htmlFor={`empleado-${index}`} className="form-label visually-hidden">Empleado</label>
              <select
                id={`empleado-${index}`}
                className="form-select"
                value={comision.empleadoId}
                onChange={(e) => handleComisionChange(index, 'empleadoId', Number(e.target.value))}
                required
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label htmlFor={`porcentaje-${index}`} className="form-label visually-hidden">Porcentaje</label>
              <input
                type="number"
                className="form-control"
                id={`porcentaje-${index}`}
                value={comision.porcentajeComision}
                onChange={(e) => handleComisionChange(index, 'porcentajeComision', Number(e.target.value))}
                step="0.01"
                required
              />
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveComision(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={handleAddComision}>
          Agregar Comisión por Empleado
        </button>
      </div>

      <button type="submit" className="btn btn-primary me-2">Guardar</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default ServicioForm;
