
import { ComisionEmpleadoServicio } from './ComisionEmpleadoServicio';

export interface Servicio {
  id?: number;
  nombre: string;
  duracion: number; // en minutos
  precio: number;
  comisionPorcentaje?: number; // e.g., 0.10 for 10%
  comisiones?: ComisionEmpleadoServicio[];
}
