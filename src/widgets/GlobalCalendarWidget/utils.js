import { learningMfeUrl } from 'data/services/lms/urls';

export const WEEKDAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
export const COURSE_ACCENTS = [
  '#1f6fb2',
  '#3a7d44',
  '#7a4eab',
  '#b45309',
  '#0f766e',
  '#9f1239',
];

export function getYmdInTz(dateInput, timeZone) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timeZone || undefined,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(d);
}

export function addMonths(year, monthIndex0, delta) {
  const d = new Date(year, monthIndex0, 1);
  d.setMonth(d.getMonth() + delta);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function daysInMonth(year, monthIndex0) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

export function firstWeekdayMondayBased(year, monthIndex0) {
  const js = new Date(year, monthIndex0, 1).getDay();
  return (js + 6) % 7;
}

export function getEventKind(ev) {
  const dt = (ev?.dateType || '').toLowerCase();
  const t = (ev?.title || '').toLowerCase();

  if (ev?.source === 'outline-due') {
    return 'assignment';
  }
  if ((dt === 'assignment-due-date' && ev?.learnerHasAccess) || dt.includes('assignment')) {
    return 'assignment';
  }
  if (t.includes('exam') || t.includes('quiz') || t.includes('midterm') || t.includes('final')) {
    return 'exam';
  }
  if (dt.includes('upgrade') || t.includes('upgrade')) {
    return 'upgrade';
  }
  if (t.includes('open') || t.includes('abre') || dt.includes('start') || dt.includes('open')) {
    return 'open';
  }
  if (t.includes('close') || t.includes('cierra') || t.includes('due') || t.includes('entrega') || dt.includes('end')) {
    return 'due';
  }

  return 'other';
}

export const getCourseAccent = (courseId) => {
  const source = courseId || 'default-course';
  const hash = source.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COURSE_ACCENTS[hash % COURSE_ACCENTS.length];
};

const getAbsoluteFallbackLink = (course, sequenceId) => {
  if (sequenceId) {
    return learningMfeUrl(`/course/${course.courseId}/${sequenceId}`);
  }
  return course.resumeUrl || course.homeUrl || null;
};

export const normalizeDateEvent = ({ event, course, timeZone }) => {
  if (!event?.date || !course?.courseId) {
    return null;
  }

  return {
    courseId: course.courseId,
    courseName: event.courseName
      || course.courseName
      || course.displayName
      || course.title
      || 'Curso sin nombre',
    date: event.date,
    dateType: event.dateType || event.date_type || '',
    description: event.description || '',
    id: [
      course.courseId,
      event.date,
      event.title || event.link_text || '',
      event.dateType || event.date_type || '',
      event.sequenceId || event.first_component_block_id || '',
    ].join('__'),
    kind: getEventKind(event),
    courseAccent: course.courseAccent || getCourseAccent(course.courseId),
    learnerHasAccess: event.learnerHasAccess ?? event.learner_has_access ?? true,
    link: event.link || getAbsoluteFallbackLink(course, event.sequenceId || event.first_component_block_id),
    sequenceId: event.sequenceId || event.first_component_block_id || null,
    source: event.source || 'api',
    title: event.title || event.link_text || 'Actividad',
    ymd: getYmdInTz(event.date, timeZone),
  };
};

const normalizeOutlineSequence = ({
  course,
  sequenceId,
  sequence,
  timeZone,
}) => {
  if (!sequence?.due) {
    return null;
  }

  return normalizeDateEvent({
    course,
    event: {
      date: sequence.due,
      dateType: 'assignment-due-date',
      description: sequence.description || '',
      learnerHasAccess: true,
      link: sequence.lms_web_url
        || getAbsoluteFallbackLink(course, sequenceId),
      sequenceId,
      source: 'outline-due',
      title: sequence.title || sequence.display_name || 'Actividad',
    },
    timeZone,
  });
};

export const extractOutlineDueEvents = ({ outline, course, timeZone }) => {
  const directSequences = outline?.courseBlocks?.sequences || outline?.course_blocks?.sequences;
  if (directSequences && typeof directSequences === 'object') {
    return Object.entries(directSequences)
      .map(([sequenceId, sequence]) => normalizeOutlineSequence({
        course,
        sequence,
        sequenceId,
        timeZone,
      }))
      .filter(Boolean);
  }

  const blockCollection = outline?.course_blocks?.blocks || outline?.courseBlocks?.blocks || outline?.blocks;
  const blocks = Array.isArray(blockCollection)
    ? blockCollection
    : Object.entries(blockCollection || {}).map(([id, block]) => ({ id, ...block }));

  return blocks
    .filter(block => block?.type === 'sequential' && block?.due)
    .map(block => normalizeOutlineSequence({
      course,
      sequence: block,
      sequenceId: block.id,
      timeZone,
    }))
    .filter(Boolean);
};

export const dedupeAndSortEvents = (events) => {
  const seen = new Map();

  events.forEach((event) => {
    if (!event) {
      return;
    }

    const dedupeKey = [
      event.courseId,
      event.date || '',
      (event.title || '').trim().toLowerCase(),
      event.dateType || '',
    ].join('__');

    if (!seen.has(dedupeKey)) {
      seen.set(dedupeKey, event);
    }
  });

  return Array.from(seen.values()).sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (da !== db) {
      return da - db;
    }

    const ka = getEventKind(a);
    const kb = getEventKind(b);
    if (ka !== kb) {
      return ka === 'assignment' ? -1 : 1;
    }

    return (a.title || '').localeCompare(b.title || '');
  });
};

export const groupEventsByDay = (allEvents, timeZone) => {
  const map = new Map();

  allEvents.forEach((event) => {
    if (!event?.date) {
      return;
    }

    const ymd = getYmdInTz(event.date, timeZone);
    if (!map.has(ymd)) {
      map.set(ymd, []);
    }
    map.get(ymd).push({ ...event, ymd });
  });

  for (const [key, value] of map.entries()) {
    value.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (da !== db) {
        return da - db;
      }

      const ka = getEventKind(a);
      const kb = getEventKind(b);
      if (ka !== kb) {
        return ka === 'assignment' ? -1 : 1;
      }

      return (a.title || '').localeCompare(b.title || '');
    });
    map.set(key, value);
  }

  return map;
};

export const getKindsByDay = (eventsByDay) => {
  const kindsByDay = new Map();

  for (const [ymd, events] of eventsByDay.entries()) {
    kindsByDay.set(ymd, Array.from(new Set(events.map(getEventKind))));
  }

  return kindsByDay;
};

export const resolveMonthLabel = ({ year, month, timeZone }) => {
  const safe = new Date(Date.UTC(year, month, 15, 12, 0, 0));
  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
    timeZone: timeZone || undefined,
  }).format(safe);
};

export const resolveUserTimeZone = (responses) => {
  const match = responses.find(Boolean);
  return match || Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const extractResumeBlockIds = (outline) => {
  const blockCollection = outline?.course_blocks?.blocks || outline?.courseBlocks?.blocks || [];
  const blocks = Array.isArray(blockCollection)
    ? blockCollection
    : Object.entries(blockCollection || {}).map(([id, block]) => ({ id, ...block }));

  return new Set(
    blocks
      .filter(block => block?.resume_block)
      .map(block => block.id)
      .filter(Boolean),
  );
};

export const extractCompletionByBlockId = (blocksData) => {
  const blockCollection = blocksData?.blocks || {};
  const blocks = Array.isArray(blockCollection)
    ? blockCollection
    : Object.values(blockCollection);

  return blocks.reduce((acc, block) => {
    if (block?.id) {
      acc.set(block.id, typeof block.completion === 'number' ? block.completion : null);
    }
    return acc;
  }, new Map());
};

export const enrichEventProgress = ({
  event,
  completionByBlockId,
  resumeBlockIds,
  todayYmd,
}) => {
  const completion = event.sequenceId ? completionByBlockId.get(event.sequenceId) : null;
  const hasCompletion = typeof completion === 'number';
  const isCompleted = hasCompletion && completion >= 1;
  const hasVisitEvidence = (
    (event.sequenceId && resumeBlockIds.has(event.sequenceId))
    || (hasCompletion && completion > 0)
    || isCompleted
  );
  const isDueToday = event.ymd === todayYmd;
  const isOverdue = event.ymd < todayYmd && !isCompleted;

  let visitState = 'unknown';
  if (hasVisitEvidence) {
    visitState = 'visited';
  } else if (event.sequenceId) {
    visitState = 'not-visited';
  }

  let progressState = 'unknown';
  if (isCompleted) {
    progressState = 'completed';
  } else if (hasVisitEvidence) {
    progressState = 'in-progress';
  } else if (isOverdue) {
    progressState = 'overdue';
  } else if (event.sequenceId || event.ymd) {
    progressState = 'pending';
  }

  return {
    ...event,
    completion,
    isDueToday,
    isOverdue,
    progressState,
    visitState,
  };
};

export const groupEventsByCourse = (events) => events.reduce((acc, event) => {
  const key = event.courseId || event.courseName || 'unknown-course';
  const current = acc.get(key) || {
    accent: event.courseAccent,
    courseId: event.courseId,
    courseName: event.courseName,
    events: [],
  };
  current.events.push(event);
  acc.set(key, current);
  return acc;
}, new Map());
