import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'learnerDashboard.globalCalendar.title',
    defaultMessage: 'Calendario',
    description: 'Title for the learner dashboard global calendar widget',
  },
  subtitle: {
    id: 'learnerDashboard.globalCalendar.subtitle',
    defaultMessage: 'Proximas fechas de tus cursos',
    description: 'Subtitle for the learner dashboard global calendar widget',
  },
  todaySection: {
    id: 'learnerDashboard.globalCalendar.todaySection',
    defaultMessage: 'Hoy',
    description: 'Heading for today events in the learner dashboard global calendar widget',
  },
  closeTodayPanel: {
    id: 'learnerDashboard.globalCalendar.closeTodayPanel',
    defaultMessage: 'Cerrar panel de hoy',
    description: 'Accessible label for the close button on the today panel in the learner dashboard global calendar widget',
  },
  todayEmpty: {
    id: 'learnerDashboard.globalCalendar.todayEmpty',
    defaultMessage: 'No hay eventos con vencimiento hoy.',
    description: 'Empty state for today events in the learner dashboard global calendar widget',
  },
  menuLabel: {
    id: 'learnerDashboard.globalCalendar.menuLabel',
    defaultMessage: 'Opciones del calendario',
    description: 'Accessible label for the visual-only menu button in the learner dashboard global calendar widget',
  },
  today: {
    id: 'learnerDashboard.globalCalendar.today',
    defaultMessage: 'Hoy',
    description: 'Button label to return to the current month in the learner dashboard global calendar widget',
  },
  loading: {
    id: 'learnerDashboard.globalCalendar.loading',
    defaultMessage: 'Cargando fechas de los cursos',
    description: 'Screen reader text for the loading state in the learner dashboard global calendar widget',
  },
  empty: {
    id: 'learnerDashboard.globalCalendar.empty',
    defaultMessage: 'No hay fechas proximas este mes.',
    description: 'Empty state for the learner dashboard global calendar widget',
  },
  unavailable: {
    id: 'learnerDashboard.globalCalendar.unavailable',
    defaultMessage: 'Los datos del calendario no estan disponibles en este momento.',
    description: 'Message shown when the learner dashboard global calendar widget cannot load any course dates',
  },
  eventsOnDate: {
    id: 'learnerDashboard.globalCalendar.eventsOnDate',
    defaultMessage: 'Eventos del {date}',
    description: 'Heading for the selected day event list in the learner dashboard global calendar widget',
  },
  noEventsForDate: {
    id: 'learnerDashboard.globalCalendar.noEventsForDate',
    defaultMessage: 'No hay eventos programados para este dia.',
    description: 'Empty state for a selected day in the learner dashboard global calendar widget',
  },
  eventsSuffix: {
    id: 'learnerDashboard.globalCalendar.eventsSuffix',
    defaultMessage: 'eventos',
    description: 'Suffix shown in the day popover title in the learner dashboard global calendar widget',
  },
  openCourse: {
    id: 'learnerDashboard.globalCalendar.openCourse',
    defaultMessage: 'Abrir curso',
    description: 'Fallback label for course dates without a specific link target',
  },
  previousMonth: {
    id: 'learnerDashboard.globalCalendar.previousMonth',
    defaultMessage: 'Mes anterior',
    description: 'Accessible label for the previous month button in the learner dashboard global calendar widget',
  },
  nextMonth: {
    id: 'learnerDashboard.globalCalendar.nextMonth',
    defaultMessage: 'Mes siguiente',
    description: 'Accessible label for the next month button in the learner dashboard global calendar widget',
  },
  dayLabel: {
    id: 'learnerDashboard.globalCalendar.dayLabel',
    defaultMessage: 'Dia {day}',
    description: 'Accessible label for a calendar day button in the learner dashboard global calendar widget',
  },
  visited: {
    id: 'learnerDashboard.globalCalendar.visited',
    defaultMessage: 'Visitado',
    description: 'Visited state badge for the learner dashboard global calendar widget',
  },
  notVisited: {
    id: 'learnerDashboard.globalCalendar.notVisited',
    defaultMessage: 'No visitado',
    description: 'Not visited state badge for the learner dashboard global calendar widget',
  },
  completed: {
    id: 'learnerDashboard.globalCalendar.completed',
    defaultMessage: 'Completado',
    description: 'Completed state badge for the learner dashboard global calendar widget',
  },
  inProgress: {
    id: 'learnerDashboard.globalCalendar.inProgress',
    defaultMessage: 'En progreso',
    description: 'In progress state badge for the learner dashboard global calendar widget',
  },
  pending: {
    id: 'learnerDashboard.globalCalendar.pending',
    defaultMessage: 'Pendiente',
    description: 'Pending state badge for the learner dashboard global calendar widget',
  },
  overdue: {
    id: 'learnerDashboard.globalCalendar.overdue',
    defaultMessage: 'Vencido',
    description: 'Overdue state badge for the learner dashboard global calendar widget',
  },
  dueToday: {
    id: 'learnerDashboard.globalCalendar.dueToday',
    defaultMessage: 'Vence hoy',
    description: 'Due today state badge for the learner dashboard global calendar widget',
  },
  homework: {
    id: 'learnerDashboard.globalCalendar.homework',
    defaultMessage: 'Tarea',
    description: 'Homework kind label for the learner dashboard global calendar widget',
  },
  exam: {
    id: 'learnerDashboard.globalCalendar.exam',
    defaultMessage: 'Examen',
    description: 'Exam kind label for the learner dashboard global calendar widget',
  },
  upgrade: {
    id: 'learnerDashboard.globalCalendar.upgrade',
    defaultMessage: 'Actualizar',
    description: 'Upgrade kind label for the learner dashboard global calendar widget',
  },
  open: {
    id: 'learnerDashboard.globalCalendar.open',
    defaultMessage: 'Abre',
    description: 'Open kind label for the learner dashboard global calendar widget',
  },
  due: {
    id: 'learnerDashboard.globalCalendar.due',
    defaultMessage: 'Entrega',
    description: 'Due kind label for the learner dashboard global calendar widget',
  },
  other: {
    id: 'learnerDashboard.globalCalendar.other',
    defaultMessage: 'Actividad del curso',
    description: 'Fallback kind label for the learner dashboard global calendar widget',
  },
});

export default messages;
