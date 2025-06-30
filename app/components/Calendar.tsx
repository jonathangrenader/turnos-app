
'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Turno } from '../models/Turno';
import { Cliente } from '../models/Cliente';
import { Servicio } from '../models/Servicio';
import { Empleado } from '../models/Empleado';

interface CalendarProps {
  turnos: Turno[];
  clientes: Cliente[];
  servicios: Servicio[];
  empleados: Empleado[];
  onDateClick: (dateStr: string, timeStr: string) => void;
  onEventClick: (turno: Turno) => void;
  onEventDrop: (turno: Turno, oldDate: string, newDate: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ turnos, clientes, servicios, empleados, onDateClick, onEventClick, onEventDrop }) => {
  const events = turnos.map(turno => {
    const cliente = clientes.find(c => c.id === turno.clienteId);
    const servicio = servicios.find(s => s.id === turno.servicioId);
    const empleado = empleados.find(e => e.id === turno.empleadoId);

    const startDateTime = `${turno.fecha}T${turno.hora}`;
    const endDateTime = servicio ? new Date(new Date(startDateTime).getTime() + servicio.duracion * 60 * 1000).toISOString().slice(0, 16) : startDateTime;

    return {
      id: String(turno.id),
      title: `${servicio?.nombre || ''} - ${cliente?.nombre || ''} (${empleado?.nombre || ''})`,
      start: startDateTime,
      end: endDateTime,
      extendedProps: { turno },
    };
  });

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      themeSystem="bootstrap5"
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      events={events}
      dateClick={(info) => onDateClick(info.dateStr.split('T')[0], info.dateStr.split('T')[1].substring(0, 5))}
      eventContent={(arg) => {
        const turno = arg.event.extendedProps.turno as Turno;
        const servicio = servicios.find(s => s.id === turno.servicioId);
        const cliente = clientes.find(c => c.id === turno.clienteId);
        const empleado = empleados.find(e => e.id === turno.empleadoId);

        return (
          <div className="fc-event-main-frame">
            <div className="fc-event-time">{arg.timeText}</div>
            <div className="fc-event-title-container">
              <div className="fc-event-title fc-sticky">
                <strong>{servicio?.nombre}</strong><br/>
                {cliente?.nombre}<br/>
                <small>{empleado?.nombre}</small>
              </div>
            </div>
          </div>
        );
      }}
      eventClick={(info) => onEventClick(info.event.extendedProps.turno as Turno)}
      eventDrop={(info) => {
        const droppedTurno = info.event.extendedProps.turno as Turno;
        const oldDate = info.oldEvent.startStr.split('T')[0];
        const newDate = info.event.startStr.split('T')[0];
        onEventDrop({
          ...droppedTurno,
          fecha: info.event.startStr.split('T')[0],
          hora: info.event.startStr.split('T')[1].substring(0, 5),
        }, oldDate, newDate);
      }}
      locale="es"
    />
  );
};

export default Calendar;
