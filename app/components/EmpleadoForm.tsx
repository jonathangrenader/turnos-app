
import React, { useState, useEffect } from 'react';
import { Empleado, HorarioEmpleado } from '../models/Empleado';
import { useNotification } from './NotificationContext';

interface EmpleadoFormProps {
  empleado?: Empleado;
  onSave: (empleado: Empleado) => void;
  onCancel: () => void;
}

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const EmpleadoForm: React.FC<EmpleadoFormProps> = ({ empleado, onSave, onCancel }) => {
  const [nombre, setNombre] = useState(empleado?.nombre || '');
  const [horarios, setHorarios] = useState<HorarioEmpleado[]>(empleado?.horarios || []);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (empleado) {
      setNombre(empleado.nombre);
      setHorarios(empleado.horarios || []);
    } else {
      setNombre('');
      setHorarios([]);
    }
  }, [empleado]);

  const handleAddHorario = () => {
    setHorarios([...horarios, { id: Date.now(), empleadoId: empleado?.id || 0, diaSemana: '', horaInicio: '', horaFin: '' }]);
  };

  const handleHorarioChange = (index: number, field: keyof HorarioEmpleado, value: string) => {
    const newHorarios = [...horarios];
    // Ensure the id is not changed if it's an existing record
    if (field === 'id') {
        // Do nothing, id should not be changed by user input
    } else {
        (newHorarios[index] as any)[field] = value;
    }
    setHorarios(newHorarios);
  };

  const handleRemoveHorario = (index: number) => {
    const newHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(newHorarios);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmpleado: Empleado = {
      ...(empleado && { id: empleado.id }), // Only include id if updating an existing employee
      nombre,
      horarios: horarios.map(h => ({
        ...h,
        id: (typeof h.id === 'number' && h.id < 1000000000000) ? undefined : h.id, // Remove temporary IDs for new entries, keep existing ones
        // empleadoId is set by the API, so we don't include it here
      })),
    };
    onSave(newEmpleado);
    showNotification('Empleado guardado exitosamente!', 'success');
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
        <label className="form-label">Horarios de Trabajo</label>
        {horarios.map((horario, index) => (
          <div key={horario.id || index} className="row mb-2 align-items-end">
            <div className="col-md-3">
              <label htmlFor={`diaSemana-${index}`} className="form-label visually-hidden">Día</label>
              <select
                id={`diaSemana-${index}`}
                className="form-select"
                value={horario.diaSemana}
                onChange={(e) => handleHorarioChange(index, 'diaSemana', e.target.value)}
                required
              >
                <option value="">Seleccione un día</option>
                {diasSemana.map(dia => (
                  <option key={dia} value={dia}>{dia}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor={`horaInicio-${index}`} className="form-label visually-hidden">Hora Inicio</label>
              <input
                type="time"
                className="form-control"
                id={`horaInicio-${index}`}
                value={horario.horaInicio}
                onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor={`horaFin-${index}`} className="form-label visually-hidden">Hora Fin</label>
              <input
                type="time"
                className="form-control"
                id={`horaFin-${index}`}
                value={horario.horaFin}
                onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveHorario(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={handleAddHorario}>
          Agregar Horario
        </button>
      </div>

      <button type="submit" className="btn btn-primary me-2">Guardar</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default EmpleadoForm;
