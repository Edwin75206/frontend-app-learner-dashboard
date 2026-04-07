import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FormattedDate, useIntl } from '@edx/frontend-platform/i18n';
import { Spinner } from '@openedx/paragon';

import useGlobalCalendarData from './hooks';
import messages from './messages';
import {
  WEEKDAYS,
  addMonths,
  daysInMonth,
  firstWeekdayMondayBased,
  getEventKind,
  getCourseAccent,
  getKindsByDay,
  getYmdInTz,
  groupEventsByCourse,
  groupEventsByDay,
  resolveMonthLabel,
} from './utils';
import './index.scss';

const stateMessages = {
  completed: 'completed',
  'due-today': 'dueToday',
  'in-progress': 'inProgress',
  'not-visited': 'notVisited',
  other: 'other',
  overdue: 'overdue',
  pending: 'pending',
  visited: 'visited',
};

const kindMessages = {
  assignment: 'homework',
  due: 'due',
  exam: 'exam',
  open: 'open',
  other: 'other',
  upgrade: 'upgrade',
};

const GlobalCalendarWidget = () => {
  const { formatMessage } = useIntl();
  const {
    courses,
    errorCount,
    events,
    isLoading,
    openDay,
    setOpenDay,
    timeZone,
  } = useGlobalCalendarData();

  const todayYmd = useMemo(() => getYmdInTz(new Date(), timeZone), [timeZone]);
  const initial = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, []);
  const [view, setView] = useState(initial);
  const [isTodayPanelDismissed, setIsTodayPanelDismissed] = useState(false);
  const containerRef = useRef(null);
  const hasAutoOpenedTodayRef = useRef(false);

  const eventsByDay = useMemo(() => groupEventsByDay(events, timeZone), [events, timeZone]);
  const kindsByDay = useMemo(() => getKindsByDay(eventsByDay), [eventsByDay]);
  const todayEvents = useMemo(
    () => events.filter(event => event.ymd === todayYmd),
    [events, todayYmd],
  );

  useEffect(() => {
    if (!hasAutoOpenedTodayRef.current && eventsByDay.has(todayYmd)) {
      setOpenDay(todayYmd);
      hasAutoOpenedTodayRef.current = true;
    }
  }, [eventsByDay, setOpenDay, todayYmd]);

  useEffect(() => {
    if (todayEvents.length > 0) {
      setIsTodayPanelDismissed(false);
    }
  }, [todayEvents.length]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!containerRef.current) {
        return;
      }
      if (!containerRef.current.contains(event.target)) {
        setOpenDay(null);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [setOpenDay]);

  if (courses.length === 0) {
    return null;
  }

  const onPrev = () => setView(current => addMonths(current.year, current.month, -1));
  const onNext = () => setView(current => addMonths(current.year, current.month, 1));
  const goToday = () => {
    const now = new Date();
    setView({ year: now.getFullYear(), month: now.getMonth() });
    setOpenDay(todayYmd);
  };

  const { year, month } = view;
  const leadingBlanks = firstWeekdayMondayBased(year, month);
  const dim = daysInMonth(year, month);
  const monthLabel = resolveMonthLabel({ month, timeZone, year });

  const cells = [];
  for (let index = 0; index < leadingBlanks; index += 1) {
    cells.push({ key: `blank-${year}-${month}-${index}`, dayNum: null });
  }
  for (let day = 1; day <= dim; day += 1) {
    cells.push({ key: `day-${year}-${month}-${day}`, dayNum: day });
  }

  const buildYmd = (dayNum) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const renderEventBadges = (event) => {
    const badges = [];

    if (event.visitState === 'visited') {
      badges.push({ label: formatMessage(messages.visited), tone: 'success' });
    } else if (event.visitState === 'not-visited') {
      badges.push({ label: formatMessage(messages.notVisited), tone: 'muted' });
    }

    if (event.progressState && event.progressState !== 'unknown') {
      let tone = 'info';
      if (event.progressState === 'completed') {
        tone = 'success';
      } else if (event.progressState === 'overdue') {
        tone = 'danger';
      }

      badges.push({
        label: formatMessage(messages[stateMessages[event.progressState]]),
        tone,
      });
    }

    if (event.isDueToday) {
      badges.push({ label: formatMessage(messages.dueToday), tone: 'warning' });
    }

    return badges;
  };

  const renderEventItem = (event) => {
    const badges = renderEventBadges(event);
    const kindLabel = formatMessage(messages[kindMessages[getEventKind(event)] || 'other']);

    return (
      <li
        key={event.id}
        className="academus-calendar__event"
        style={{ '--event-accent': event.courseAccent || getCourseAccent(event.courseId) }}
      >
        <span className="academus-calendar__event-icon" />

        <div className="academus-calendar__event-body">
          {event.link ? (
            <a href={event.link} className="academus-calendar__event-link">
              {event.title || formatMessage(messages.openCourse)}
            </a>
          ) : (
            <div className="academus-calendar__event-link academus-calendar__event-link--static">
              {event.title || formatMessage(messages.openCourse)}
            </div>
          )}

          <div className="academus-calendar__event-course">
            {event.courseName || 'Curso sin nombre'}
          </div>

          <div className="academus-calendar__event-meta">
            {badges.map(badge => (
              <span
                key={`${event.id}-${badge.label}`}
                className={`academus-calendar__badge academus-calendar__badge--${badge.tone}`}
              >
                {badge.label}
              </span>
            ))}
            <span className="academus-calendar__event-kind">{kindLabel}</span>
          </div>

          {event.description && <div className="academus-calendar__event-desc">{event.description}</div>}
        </div>
      </li>
    );
  };

  return (
    <section id="global-calendar-widget" className="mb-4" ref={containerRef}>
      <div className="academus-calendar">
        <div className="academus-calendar__header">
          <div>
            <div className="academus-calendar__title">{formatMessage(messages.title)}</div>
            <div className="academus-calendar__subtitle">{formatMessage(messages.subtitle)}</div>
          </div>
          <button type="button" className="academus-calendar__menu" aria-label={formatMessage(messages.menuLabel)}>
            ☰
          </button>
        </div>

        <div className="academus-calendar__nav">
          <button type="button" className="academus-calendar__navbtn" onClick={onPrev} aria-label={formatMessage(messages.previousMonth)}>
            ‹
          </button>

          <div className="academus-calendar__monthWrap">
            <div className="academus-calendar__month">{monthLabel}</div>
            <button type="button" className="academus-calendar__todayBtn" onClick={goToday}>
              {formatMessage(messages.today)}
            </button>
          </div>

          <button type="button" className="academus-calendar__navbtn" onClick={onNext} aria-label={formatMessage(messages.nextMonth)}>
            ›
          </button>
        </div>

        {todayEvents.length > 0 && !isTodayPanelDismissed && (
          <div className="academus-calendar__today">
            <div className="academus-calendar__today-bar">
              <div className="academus-calendar__today-header">{formatMessage(messages.todaySection)}</div>
              <button
                type="button"
                className="academus-calendar__today-close"
                aria-label={formatMessage(messages.closeTodayPanel)}
                onClick={() => setIsTodayPanelDismissed(true)}
              >
                ×
              </button>
            </div>
            <ul className="academus-calendar__today-list">
              {todayEvents.map(event => renderEventItem(event))}
            </ul>
          </div>
        )}

        <div className="academus-calendar__grid">
          {WEEKDAYS.map(day => (
            <div key={day} className="academus-calendar__dow">{day}</div>
          ))}

          {isLoading && (
            <div className="academus-calendar__status">
              <Spinner animation="border" screenReaderText={formatMessage(messages.loading)} />
            </div>
          )}

          {!isLoading && !events.length && (
            <div className="academus-calendar__empty">
              {errorCount > 0 ? formatMessage(messages.unavailable) : formatMessage(messages.empty)}
            </div>
          )}

          {!isLoading && events.length > 0 && cells.map(({ key, dayNum }) => {
            if (!dayNum) {
              return <div key={key} className="academus-calendar__cell academus-calendar__cell--empty" />;
            }

            const ymd = buildYmd(dayNum);
            const dayEvents = eventsByDay.get(ymd) || [];
            const hasEvents = dayEvents.length > 0;
            const isOpen = openDay === ymd;
            const isToday = ymd === todayYmd;
            const kinds = kindsByDay.get(ymd) || [];
            const popoverSafeDate = `${ymd}T12:00:00`;

            return (
              <div key={ymd} className="academus-calendar__cell">
                <button
                  type="button"
                  className={[
                    'academus-calendar__day',
                    hasEvents ? 'academus-calendar__day--has' : '',
                    isOpen ? 'academus-calendar__day--open' : '',
                    isToday ? 'academus-calendar__day--today' : '',
                  ].join(' ').trim()}
                  onClick={() => setOpenDay(isOpen ? null : ymd)}
                  aria-label={formatMessage(messages.dayLabel, { day: dayNum })}
                >
                  {dayNum}
                </button>

                {hasEvents && (
                  <div className="academus-calendar__marks" aria-hidden="true">
                    {kinds.slice(0, 5).map(kind => (
                      <span key={kind} className={`academus-calendar__mark academus-calendar__mark--${kind}`} title={kind} />
                    ))}
                    {dayEvents.length > 5 && (
                      <span className="academus-calendar__more">+{dayEvents.length - 5}</span>
                    )}
                  </div>
                )}

                {isOpen && hasEvents && (
                  <div className="academus-calendar__popover" role="dialog">
                    <div className="academus-calendar__popover-title">
                      <FormattedDate
                        value={popoverSafeDate}
                        weekday="long"
                        year="numeric"
                        month="long"
                        day="numeric"
                        timeZone={timeZone || undefined}
                      />{' '}
                      {formatMessage(messages.eventsSuffix)}
                    </div>

                    <div className="academus-calendar__events-groups">
                      {Array.from(groupEventsByCourse(dayEvents).values()).map(group => (
                        <div
                          key={group.courseId || group.courseName}
                          className="academus-calendar__course-group"
                          style={{ '--course-accent': group.accent }}
                        >
                          {group.events.length > 1 && (
                            <div className="academus-calendar__course-group-title">{group.courseName}</div>
                          )}
                          <ul className="academus-calendar__events">
                            {group.events.map(event => renderEventItem(event))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="academus-calendar__popover-tip" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalCalendarWidget;
