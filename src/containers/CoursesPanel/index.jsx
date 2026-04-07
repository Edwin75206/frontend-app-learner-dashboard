import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import { reduxHooks } from 'hooks';
import {
  CourseFilterControls,
} from 'containers/CourseFilterControls';
import CourseListSlot from 'plugin-slots/CourseListSlot';
import NoCoursesViewSlot from 'plugin-slots/NoCoursesViewSlot';

import { useCourseListData } from './hooks';

import messages from './messages';

import './index.scss';

/**
 * Renders the list of CourseCards, as well as the controls (CourseFilterControls) for modifying the list.
 * Also houses the NoCoursesView to display if the user hasn't enrolled in any courses.
 * @returns List of courses as CourseCards or empty state
*/
export const CoursesPanel = () => {
  const { formatMessage } = useIntl();
  const hasCourses = reduxHooks.useHasCourses();
  const courseListData = useCourseListData();
  const [searchTerm, setSearchTerm] = React.useState('');
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const previousSearchTermRef = React.useRef(normalizedSearchTerm);
  const filteredCourseList = courseListData.allCourses.filter((course) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [
      course.course?.courseName,
      course.courseProvider?.name,
      course.course?.courseNumber,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });
  const filteredNumPages = courseListData.pageSize === 0
    ? 1
    : Math.max(1, Math.ceil(filteredCourseList.length / courseListData.pageSize));
  const searchPageNumber = normalizedSearchTerm
    ? Math.min(courseListData.pageNumber, filteredNumPages)
    : courseListData.pageNumber;
  const paginatedFilteredList = courseListData.pageSize === 0
    ? filteredCourseList
    : filteredCourseList.slice(
      (searchPageNumber - 1) * courseListData.pageSize,
      searchPageNumber * courseListData.pageSize,
    );
  const renderedCourseList = normalizedSearchTerm
    ? paginatedFilteredList
    : courseListData.visibleList;
  const renderedNumPages = normalizedSearchTerm
    ? filteredNumPages
    : courseListData.numPages;
  const renderedCourseListData = {
    ...courseListData,
    numPages: renderedNumPages,
    visibleList: renderedCourseList,
  };
  const totalCourses = courseListData.allCourses.length;
  const visibleCourses = renderedCourseList.length;

  React.useEffect(() => {
    if (
      previousSearchTermRef.current !== normalizedSearchTerm
      && courseListData.pageNumber !== 1
    ) {
      courseListData.setPageNumber(1);
    }
    previousSearchTermRef.current = normalizedSearchTerm;
  }, [normalizedSearchTerm, courseListData.pageNumber, courseListData.setPageNumber]);

  return (
    <div className="course-list-container">
      <div className="course-list-heading-container">
        <h2 className="course-list-title">{formatMessage(messages.myCourses)}</h2>
        {hasCourses && (
          <span className="course-list-count" aria-live="polite">
            {formatMessage(messages.showingCourses, { visibleCourses, totalCourses })}
          </span>
        )}
      </div>
      {hasCourses ? (
        <>
          <div className="course-list-controls-bar">
            <Form.Group className="course-search-control mb-0">
              <Form.Control
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={formatMessage(messages.searchPlaceholder)}
              />
            </Form.Group>
            <div className="course-filter-controls-container">
              <CourseFilterControls {...courseListData.filterOptions} />
            </div>
          </div>
          {renderedCourseList.length > 0 ? (
            <CourseListSlot courseListData={renderedCourseListData} />
          ) : (
            <p className="mb-0">{formatMessage(messages.noSearchResults)}</p>
          )}
        </>
      ) : <NoCoursesViewSlot />}
    </div>
  );
};

CoursesPanel.propTypes = {};

export default CoursesPanel;
