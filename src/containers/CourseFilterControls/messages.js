import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  courseStatus: {
    id: 'learner-dash.courseListFilters.courseStatus',
    description: 'Encabezado del formulario de filtros de estado del curso',
    defaultMessage: 'Estado del curso',
  },
  inProgress: {
    id: 'learner-dash.courseListFilters.inProgress',
    description: 'Etiqueta del checkbox de filtro en progreso para la lista de cursos',
    defaultMessage: 'En progreso',
  },
  notStarted: {
    id: 'learner-dash.courseListFilters.notStarted',
    description: 'Etiqueta del checkbox de filtro no iniciado para la lista de cursos',
    defaultMessage: 'No iniciado',
  },
  done: {
    id: 'learner-dash.courseListFilters.done',
    description: 'Etiqueta del checkbox de filtro completado para la lista de cursos',
    defaultMessage: 'Completado',
  },
  notEnrolled: {
    id: 'learner-dash.courseListFilters.notEnrolled',
    description: 'Etiqueta del checkbox de filtro no inscrito para la lista de cursos',
    defaultMessage: 'No inscrito',
  },
  upgraded: {
    id: 'learner-dash.courseListFilters.upgraded',
    description: 'Etiqueta del checkbox de filtro mejorado para la lista de cursos',
    defaultMessage: 'Actualizado',
  },
  clearAll: {
    id: 'learner-dash.courseListFilters.clearAll',
    description: 'Texto del botón para limpiar todos los filtros',
    defaultMessage: 'Limpiar todo',
  },
  sort: {
    id: 'learner-dash.courseListFilters.sort',
    description: 'Encabezado del formulario de ordenamiento',
    defaultMessage: 'Ordenar',
  },
  sortLastEnrolled: {
    id: 'learner-dash.courseListFilters.sortLastEnrolled',
    description: 'Texto de la opción de ordenamiento por última inscripción',
    defaultMessage: 'Última inscripción',
  },
  sortTitle: {
    id: 'learner-dash.courseListFilters.sortTitle',
    description: 'Texto de la opción de ordenamiento por título',
    defaultMessage: 'Título (A-Z)',
  },
  refine: {
    id: 'learner-dash.courseListFilters.refine',
    description: 'Texto del botón de filtros',
    defaultMessage: 'Refinar',
  },
});

export default messages;
