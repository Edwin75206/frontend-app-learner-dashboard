import {
  dedupeAndSortEvents,
  extractOutlineDueEvents,
  getEventKind,
  getYmdInTz,
  normalizeDateEvent,
  resolveUserTimeZone,
} from './utils';

describe('GlobalCalendarWidget utils', () => {
  describe('getYmdInTz', () => {
    it('formats dates in the supplied timezone', () => {
      expect(getYmdInTz('2026-03-17T02:30:00Z', 'America/Mexico_City')).toEqual('2026-03-16');
    });
  });

  describe('getEventKind', () => {
    it('classifies assignment-like events', () => {
      expect(getEventKind({ dateType: 'assignment-due-date' })).toEqual('assignment');
    });

    it('falls back to other when no keywords match', () => {
      expect(getEventKind({ dateType: 'custom' })).toEqual('other');
    });
  });

  describe('normalizeDateEvent', () => {
    const course = {
      courseId: 'course-v1:edX+DemoX+2026_T1',
      courseName: 'Demo Course',
      homeUrl: '/courses/demo/home',
      resumeUrl: '/courses/demo/resume',
    };

    it('normalizes course date blocks into a global event shape', () => {
      const event = normalizeDateEvent({
        event: {
          date: '2026-03-17T15:00:00Z',
          dateType: 'assignment-due-date',
          description: 'Finish unit 1',
          sequenceId: 'block-v1:test+type@sequential+block@abc123',
          learnerHasAccess: true,
          link: 'http://localhost:2000/learning/course/demo',
          title: 'Homework 1',
        },
        course,
        timeZone: 'UTC',
      });

      expect(event).toMatchObject({
        courseId: course.courseId,
        courseName: course.courseName,
        dateType: 'assignment-due-date',
        kind: 'assignment',
        link: 'http://localhost:2000/learning/course/demo',
        sequenceId: 'block-v1:test+type@sequential+block@abc123',
        title: 'Homework 1',
        ymd: '2026-03-17',
      });
    });

    it('falls back to course links when the date block does not provide one', () => {
      const event = normalizeDateEvent({
        event: {
          date: '2026-03-17T15:00:00Z',
          dateType: 'course-start-date',
        },
        course,
        timeZone: 'UTC',
      });

      expect(event.link).toEqual(course.resumeUrl);
    });
  });

  describe('extractOutlineDueEvents', () => {
    const course = {
      courseId: 'course-v1:edX+DemoX+2026_T1',
      courseName: 'Demo Course',
      homeUrl: '/courses/demo/home',
      resumeUrl: '/courses/demo/resume',
    };

    it('extracts due dates from a normalized sequences object', () => {
      const events = extractOutlineDueEvents({
        course,
        outline: {
          courseBlocks: {
            sequences: {
              'block-v1:test+type@sequential+block@abc123': {
                due: '2026-03-17T15:00:00Z',
                title: 'Sequence 1',
              },
            },
          },
        },
        timeZone: 'UTC',
      });

      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        source: 'outline-due',
        title: 'Sequence 1',
        ymd: '2026-03-17',
      });
    });
  });

  describe('dedupeAndSortEvents', () => {
    it('deduplicates repeated events and sorts by time then kind', () => {
      const events = dedupeAndSortEvents([
        {
          courseId: 'course-1',
          date: '2026-03-17T18:00:00Z',
          title: 'Homework 1',
          dateType: 'assignment-due-date',
          source: 'api',
          kind: 'assignment',
        },
        {
          courseId: 'course-1',
          date: '2026-03-17T18:00:00Z',
          title: 'Homework 1',
          dateType: 'assignment-due-date',
          source: 'outline-due',
          kind: 'assignment',
        },
        {
          courseId: 'course-1',
          date: '2026-03-17T19:00:00Z',
          title: 'Exam',
          dateType: 'exam',
          source: 'api',
          kind: 'exam',
        },
      ]);

      expect(events).toHaveLength(2);
      expect(events.map(event => event.title)).toEqual(['Homework 1', 'Exam']);
    });
  });

  describe('resolveUserTimeZone', () => {
    it('returns the first defined timezone', () => {
      expect(resolveUserTimeZone([null, '', 'America/Mexico_City', 'UTC'])).toEqual('America/Mexico_City');
    });
  });
});
