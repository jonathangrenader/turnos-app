
import { Turno } from './Turno';

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  turnos?: Turno[]; // Add this line
}
