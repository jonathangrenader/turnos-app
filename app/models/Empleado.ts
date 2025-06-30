
import { Turno } from './Turno';
import { ComisionEmpleadoServicio } from './ComisionEmpleadoServicio';

export interface HorarioEmpleado {
  id: number;
  empleadoId: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

export interface Empleado {
  id: number;
  nombre: string;
  horarios?: HorarioEmpleado[];
  turnos?: Turno[];
  comisiones?: ComisionEmpleadoServicio[];
}
