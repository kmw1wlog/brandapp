# Open Source Calendar Review

## Decision

- Owner project timeline: custom Branch UI. It must stay a D-30 opening project board, not a generic calendar.
- Consultant timetable: FullCalendar Standard packages.
- Drag/drop: defer. If needed later, use dnd-kit for owner task date movement.

## Comparison

| Library | License | React 19 / Next 15 | Weekly timetable | Slot selection | Drag/drop | Mobile | CSS customization | Bundle / SSR note | Maintenance | Free / paid |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FullCalendar Standard | MIT | `@fullcalendar/react@6.1.20` peer range includes React 19 | Yes, `timeGridWeek` | Yes, interaction plugin | Basic event interaction | Good with responsive containers | High | Client component only | Active | Standard free, resource timeline paid |
| Schedule-X | MIT | React adapter exists, verify per release before production | Yes | Yes | Yes | Good | High | Client component recommended | Active | Free core |
| React Big Calendar | MIT | React support exists, React 19 should be verified before production | Yes | Possible | Addon based | Moderate | Moderate | CSS import required, client usage safer | Mature | Free |
| dnd-kit | MIT | React 19 compatible pattern, verify exact release before production | Not a calendar | Not a calendar | Strong | Good | App-defined | No calendar UI included | Active | Free |

## Selected Use

FullCalendar Standard is used only for consultant weekly slots. The implementation does not use FullCalendar Scheduler or paid resource timeline features. Multiple consultants are represented through filters and separate visible calendars, which matches the current demo scope.
