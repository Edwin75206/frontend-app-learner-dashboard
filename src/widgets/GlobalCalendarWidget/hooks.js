import React from 'react';

import { reduxHooks } from 'hooks';
import api from 'data/services/lms/api';
import { baseAppUrl } from 'data/services/lms/urls';

import {
  dedupeAndSortEvents,
  enrichEventProgress,
  extractCompletionByBlockId,
  extractOutlineDueEvents,
  extractResumeBlockIds,
  getCourseAccent,
  getYmdInTz,
  normalizeDateEvent,
  resolveUserTimeZone,
} from './utils';

const requestLimit = 4;

const runWithConcurrency = async (items, worker, limit = requestLimit) => {
  const results = new Array(items.length);
  let currentIndex = 0;

  const runNext = async () => {
    const index = currentIndex;
    currentIndex += 1;

    if (index >= items.length) {
      return;
    }

    try {
      results[index] = { status: 'fulfilled', value: await worker(items[index]) };
    } catch (error) {
      results[index] = { status: 'rejected', reason: error };
    }

    await runNext();
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => runNext()));
  return results;
};

const mapCourseData = (courseData) => Object.values(courseData || {})
  .map(card => ({
    courseId: card?.courseRun?.courseId,
    courseName: card?.course?.courseName
      || card?.course?.displayName
      || card?.courseRun?.displayName
      || card?.courseRun?.title
      || card?.title
      || 'Curso sin nombre',
    courseAccent: getCourseAccent(card?.courseRun?.courseId),
    homeUrl: card?.courseRun?.homeUrl || null,
    resumeUrl: baseAppUrl(card?.courseRun?.resumeUrl) || null,
  }))
  .filter(course => course.courseId);

export const useGlobalCalendarData = () => {
  const courseData = reduxHooks.useCourseData();
  const courses = React.useMemo(() => mapCourseData(courseData), [courseData]);
  const [state, setState] = React.useState({
    errorCount: 0,
    events: [],
    isLoading: false,
    openDay: null,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  React.useEffect(() => {
    let isMounted = true;

    if (courses.length === 0) {
      setState({
        errorCount: 0,
        events: [],
        isLoading: false,
        openDay: null,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      return () => {};
    }

    setState(prev => ({ ...prev, errorCount: 0, isLoading: true }));

    const loadEvents = async () => {
      const results = await runWithConcurrency(courses, async (course) => {
        const [datesResponse, outlineResponse, blocksResponse] = await Promise.allSettled([
          api.getCourseDates({ courseId: course.courseId }),
          api.getCourseOutline({ courseId: course.courseId }),
          api.getCourseBlocksProgress({ courseId: course.courseId }),
        ]);

        return {
          blocks: blocksResponse.status === 'fulfilled' ? blocksResponse.value.data : null,
          course,
          dates: datesResponse.status === 'fulfilled' ? datesResponse.value.data : null,
          outline: outlineResponse.status === 'fulfilled' ? outlineResponse.value.data : null,
          partialErrors: [datesResponse, outlineResponse, blocksResponse]
            .filter(result => result.status === 'rejected').length,
        };
      });

      if (!isMounted) {
        return;
      }

      const fulfilled = results.filter(result => result?.status === 'fulfilled').map(result => result.value);
      const timeZone = resolveUserTimeZone(fulfilled.flatMap(result => [
        result.dates?.user_timezone,
        result.outline?.dates_widget?.user_timezone,
        result.outline?.user_timezone,
      ]));
      const todayYmd = getYmdInTz(new Date(), timeZone);

      const allEvents = dedupeAndSortEvents(fulfilled.flatMap((result) => {
        const completionByBlockId = extractCompletionByBlockId(result.blocks);
        const resumeBlockIds = extractResumeBlockIds(result.outline);
        const apiEvents = (result.dates?.course_date_blocks || [])
          .filter(event => event?.date)
          .map(event => normalizeDateEvent({
            course: result.course,
            event: { ...event, source: 'api' },
            timeZone,
          }));

        const outlineDueEvents = extractOutlineDueEvents({
          course: result.course,
          outline: result.outline,
          timeZone,
        });

        return [...apiEvents, ...outlineDueEvents].map(event => enrichEventProgress({
          completionByBlockId,
          event,
          resumeBlockIds,
          todayYmd,
        }));
      }));

      const errorCount = (
        results.length - fulfilled.length
        + fulfilled.reduce((acc, result) => acc + result.partialErrors, 0)
      );

      setState({
        errorCount,
        events: allEvents,
        isLoading: false,
        openDay: allEvents.some(event => event.ymd === todayYmd)
          ? todayYmd
          : null,
        timeZone,
      });
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [courses]);

  return {
    ...state,
    courses,
    setOpenDay: (openDay) => setState(prev => ({ ...prev, openDay })),
  };
};

export default useGlobalCalendarData;
