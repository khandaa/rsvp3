# Product Requirements Document (PRD): Event RSVP Application for Wedding Management

## 1. Introduction/Overview
This application is designed for event management companies to efficiently manage weddings. It provides a comprehensive platform to handle guest lists, groupings, RSVP tracking, event schedules, logistics, and notifications, streamlining the event planning and execution process.

## 2. Goals
- Enable event managers to manage guest information and groupings with ease.
- Provide real-time RSVP tracking and statistics.
- Allow creation and sharing of detailed event schedules.
- Simplify logistics management for travel, accommodation, and transportation.
- Facilitate timely and automated notifications to guests.

## 3. User Stories
### Application Owner
- As an application owner, I want be able to manage various roles that can be assigned to users so I can control access to different features. Some of the roles are event management company, event manager, event manager co-host, event host, event co-host, guest, hospitality team, vendor, etc.
- As an application owner, I want to have dashboard of all the event management companies onboarded and their events so I can monitor the events and manage them.
- As an application owner, I want to be able to manage users and their roles so I can control access to different features. Each feature should have role based access control.
- as an application owner, I should get statistics of no of events, no of guests, no of RSVPs, no of cancellations, no of no shows, etc.
- as an application owner, I should be able to export the guest list and event details to a spreadsheet so I can share it with other team members.
- As an application owner, I want to bulk import events from a spreadsheet so I can quickly set up the event list for large weddings.
- As an application owner, I want to search and filter events by name or status so I can easily find specific events.

### Event management company
- As an event management company, I want to be able to onboard users with various roles under me so that they get access to appropriate screens and functionality. Some of the roles are event management company, event manager, event manager co-host, event host, event co-host, guest, hospitality team, vendor, etc.
- As an event management company, I want to have dashboard of all the event management companies onboarded and their events so I can monitor the events and manage them.
- As an event management company, I want to be able to manage users and their roles so I can control access to different features. Each feature should have role based access control.
- as an event management company, I should get statistics of no of events, no of guests, no of RSVPs, no of cancellations, no of no shows, etc.
- as an event management company, I should be able to export the guest list and event details to a spreadsheet so I can share it with other team members.
- As an event management company, I want to bulk import events from a spreadsheet so I can quickly set up the event list for large weddings.
- As an event management company, I want to search and filter events by name or status so I can easily find specific events.
- as an event management company, I should be able to assign one or more events to event manager / co-host and they get to see data relevant to them.

### Event Manager
- As an event manager, I want to be able to onboard users with various roles under me so that they get access to appropriate screens and functionality. Some of the roles are event management company, event manager, event manager co-host, event host, event co-host, guest, hospitality team, vendor, etc.
- As an event manager, I want to have dashboard of all the event management companies onboarded and their events so I can monitor the events and manage them.
- As an event manager, I want to be able to manage users and their roles so I can control access to different features. Each feature should have role based access control.
- as an event manager, I should get statistics of no of events, no of guests, no of RSVPs, no of cancellations, no of no shows, etc.
- as an event manager, I should be able to export the guest list and event details to a spreadsheet so I can share it with other team members.
- As an event manager, I want to bulk import events from a spreadsheet so I can quickly set up the event list for large weddings.
- As an event manager, I want to search and filter events by name or status so I can easily find specific events.

### Guest Management
- As an event manager, I want to add and edit guest details so I can keep the guest list accurate and up-to-date.
- As an event manager, I want to bulk import guests from a spreadsheet so I can quickly set up the guest list for large weddings.
- As an event manager, I want to search and filter guests by name or status so I can easily find specific guests.

### Artist Management
- As an event manager, I want to add and edit artist details so I can keep the artist list accurate and up-to-date.
- As an event manager, I want to bulk import artists from a spreadsheet so I can quickly set up the artist list for large weddings.
- As an event manager, I want to search and filter artists by name or status so I can easily find specific artists.
- As an event manager, I want to track artist attendance so I can monitor their participation.
- As an event manager, I want to send notifications to artists about important updates or changes so everyone is informed in real time.
- As an event manager, I want to manage travel, stay and food arrangement for artists and their teams like any other guests. 
### Groups
- As an event manager, I want to create guest groups (e.g., family, friends, colleagues) so I can manage invitations and logistics for each group.
- As an event manager, I want to assign guests to one or more groups so I can organize seating and event participation.
- As an event manager, I want to edit or delete groups so I can keep groupings relevant and organized.

### RSVP Status
- As an event manager, I want to track each guest’s RSVP status (attending, not attending, no response) so I can monitor attendance.
- As an event manager, I want to send RSVP reminders to guests who haven’t responded so I can maximize response rates.
- As an event manager, I want to view RSVP statistics in a dashboard so I can quickly assess the overall event status.
- As a guest, I want to update my RSVP status via a secure link shared with me so I can easily confirm or decline my attendance.

### Schedule/Events
- As an event manager, I want to create and edit the wedding schedule so guests know the timings and locations of each event.
- As an event manager, I want to assign specific guests or groups to particular events (e.g., only family for a rehearsal dinner) so invitations are personalized.
- As an event manager, I want to share the schedule with guests so everyone is informed.

### Logistics
- As an event manager, I want to manage guest travel details (e.g., arrival mode, pickup time) so I can coordinate transportation.
- As an event manager, I want to track stay arrangements for guests so I can ensure everyone has accommodation.
- As an event manager, I want to assign pick & drop logistics to guests or groups so transportation is streamlined.

### Notifications
- As an event manager, I want to send notifications to guests about important updates or changes so everyone is informed in real time.
- As an event manager, I want to automate reminders for RSVP, travel, or schedule changes so I save time on manual communication.
- As an event manager, I want to run a chatbot for guest queries so guests can get quick answers without direct intervention.

## 4. Functional Requirements
1. The system must allow event managers to add, edit, delete, and bulk import guest information.
2. The system must support creation, editing, and deletion of guest groups, and assignment of guests to groups.
3. The system must allow tracking and updating of RSVP statuses for each guest.
4. The system must provide a dashboard to display RSVP statistics and guest status summaries.
5. The system must enable creation, editing, and sharing of event schedules and assignment of guests/groups to events.
6. The system must manage logistics, including travel modes, stay arrangements, and pick & drop assignments for guests and groups.
7. The system must support sending manual and automated notifications (including reminders) to guests.
8. The system must provide a chatbot or FAQ feature for guest queries.
9. The system must allow guests to update their own RSVP status via a secure link.
10. The system must provide dashboards with tables and visualizations for guest lists and logistics reporting/export.

### Additional functionality (not required for now)
- Payment processing for event-related expenses.
- Social media integration or sharing.
- Guest self-registration (guests are managed by event managers only).
- Vendor management (catering, photography, etc.)
### out of scope
- Multi-language support (not required for now).
- Native mobile app (responsive web app only).

## 6. Design Considerations
- The application should use a clean, modern, and responsive UI similar to the provided mockup.
- UI should be accessible and easy to use for event managers and guests.
- Branding should be customizable for different event management companies.
- All features must be accessible and usable on both desktop and mobile browsers (responsive design).
- The database design should be done at the beginning of the project. Use @db_structure.txt for the database design.
- Ensure that the application is secure and follows best practices for authentication and authorization.
- Ensure that the application is scalable and follows best practices for performance and security.
- Ensure that the application is maintainable and follows best practices for code quality and documentation.
- The frontend and backend integration when done with APIs should have proper CORS implementation and take care of error handling. It should enable frontend originating from 3001-3010 to access the backend APIs. 
- The application should be able to handle large number of users and events.
- The application should be able to handle large number of guests and RSVPs.
- The application should be able to handle large number of notifications.
- The application should be able to handle large number of API requests.

## 7. Technical Considerations
- Should support integration with email and WhatsApp gateways for notifications.
- Should be built as a web application (frontend in React, backend in Flask as per user rules).
- Must use APIs for frontend-backend interaction.
- Should support secure user authentication and role-based access control.
- Should be scalable to handle events of varying sizes.
- Secure RSVP update links for guests (tokenized URLs).
- The sidebar menu should be customized for each role so that they get to see functionality relevant to them.

## 8. Success Metrics
- 95%+ of guests have RSVP status updated before the event.
- Event managers can set up an event and guest list in under 30 minutes.
- Notifications are delivered to 99% of guests without errors.
- Positive feedback from event managers and guests on ease of use.
- Dashboards and reporting meet event managers' needs for tracking and exporting data.

## 9. Open Questions
- What level of granularity is needed for RSVP status (e.g., plus-ones, dietary preferences)?- yes no of guests, dietary preferences, room preferences etc
- Should there be support for custom fields in guest or logistics data? - yes
- Are there any specific data retention or privacy requirements? - yes. the data should be retained for 6 months after the event.
- Are there any specific data export requirements? - yes. the data should be exported in a format that can be imported into a spreadsheet.
- Are there any specific data import requirements? - yes. the data should be imported from a spreadsheet.

---

*This PRD is intended for implementation by a senior developer and will be updated as open questions are resolved.*
