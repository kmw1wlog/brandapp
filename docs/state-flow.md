# Branch State Flow

## Storage

UI components use `lib/branch/storage` instead of accessing localStorage keys directly. The default adapter is localStorage. The Supabase adapter currently falls back to localStorage so the demo works without live credentials.

## Timeline to Appointment

1. Owner opens `/dashboard/startup/timetable`.
2. Task dates are calculated from `targetOpenDate` and each task D-day offset.
3. The owner clicks a task consultation CTA.
4. `/dashboard/startup/consultation?category=...&taskId=...` opens with category and task context.
5. Waitlist submit sets the task status to `consultation_waiting`.
6. Active sample slot booking creates an `Appointment` and sets the task status to `booked`.
7. Cancelling an appointment updates it to `cancelled` and returns the task to `consultation_waiting`.

## Persistence

The v3 timeline key migrates legacy `branch_timeline_v2` status strings when present. JSON parse errors clear the broken key and recover with safe defaults.
