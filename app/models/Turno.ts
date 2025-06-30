
import { Cliente } from './Cliente';
import { Servicio } from './Servicio';
import { Empleado } from './Empleado';

export interface Turno {
  id: number;
  fecha: string;
  hora: string;
  clienteId: number;
  cliente?: Cliente; // Optional, for including related data
  servicioId: number;
  servicio?: Servicio; // Optional, for including related data
  empleadoId: number;
  empleado?: Empleado; // Optional, for including related data
}
