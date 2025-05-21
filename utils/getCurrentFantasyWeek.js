// getCurrentFantasyWeek.js

export function getCurrentFantasyWeek(date = new Date()) {
  const schedule = [
    { week: 1, start: '2025-09-04', end: '2025-09-09' },
    { week: 2, start: '2025-09-11', end: '2025-09-16' },
    { week: 3, start: '2025-09-18', end: '2025-09-23' },
    { week: 4, start: '2025-09-25', end: '2025-09-30' },
    { week: 5, start: '2025-10-02', end: '2025-10-07' },
    { week: 6, start: '2025-10-09', end: '2025-10-14' },
    { week: 7, start: '2025-10-16', end: '2025-10-21' },
    { week: 8, start: '2025-10-23', end: '2025-10-28' },
    { week: 9, start: '2025-10-30', end: '2025-11-04' },
    { week: 10, start: '2025-11-06', end: '2025-11-11' },
    { week: 11, start: '2025-11-13', end: '2025-11-18' },
    { week: 12, start: '2025-11-20', end: '2025-11-25' },
    { week: 13, start: '2025-11-27', end: '2025-12-02' },
    { week: 14, start: '2025-12-04', end: '2025-12-09' },
    { week: 15, start: '2025-12-11', end: '2025-12-16' },
    { week: 16, start: '2025-12-18', end: '2025-12-23' },
    { week: 17, start: '2025-12-25', end: '2025-12-30' },
    { week: 18, start: '2026-01-01', end: '2026-01-06' }
  ];

  const current = new Date(date);
  for (const entry of schedule) {
    const start = new Date(entry.start);
    const end = new Date(entry.end);
    if (current >= start && current <= end) {
      return entry.week;
    }
  }
  return null; // Not in season
}
