import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  myCourses: {
    id: 'dashboard.mycourses',
    defaultMessage: 'Mis cursos',
    description: 'Encabezado de la lista de cursos',
  },
  searchPlaceholder: {
    id: 'dashboard.searchCoursePlaceholder',
    defaultMessage: 'Buscar curso',
    description: 'Texto placeholder para filtrar la lista visible de cursos',
  },
  noSearchResults: {
    id: 'dashboard.noSearchResults',
    defaultMessage: 'No se encontraron cursos',
    description: 'Mensaje que se muestra cuando ningún curso visible coincide con la búsqueda',
  },
  showingCourses: {
    id: 'dashboard.showingCourses',
    defaultMessage: 'Mostrando {visibleCourses} de {totalCourses}',
    description: 'Texto del contador de cursos visibles y totales en la cabecera',
  },
});

export default messages;
