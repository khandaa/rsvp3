# Product Requirements Document: RSVP Event Application

## 1. Introduction/Overview

The RSVP Event Application is a comprehensive event management system specifically designed for wedding planning and guest management. This full-stack web application enables users to efficiently manage wedding RSVPs, guests, groups, events, logistics, and communications. It provides a centralized platform for tracking guest responses, managing event details, and coordinating logistics, addressing the complex challenges of wedding planning and guest coordination.

## 2. Goals

- Provide a centralized system to manage all aspects of wedding guest management and RSVP tracking
- Simplify guest list organization with robust search, filtering, and grouping capabilities
- Streamline communication with guests through multiple channels (Email, SMS, WhatsApp)
- Offer reporting and analytics to track RSVP responses and plan accordingly
- Provide secure, personalized RSVP links for each guest
- Enable logistics management for guest travel, accommodations, and transportation
- Create a user-friendly interface for both administrators and guests
- Implement role-based access control for each functionality
- Enable event managers to manage guest information and groupings with ease.
- Provide real-time RSVP tracking and statistics.
- Allow creation and sharing of detailed event schedules.
- Simplify logistics management for travel, accommodation, and transportation.
- Facilitate timely and automated notifications to guests.

## 3. User Stories
- **As a sofware owner**, I want to manage event management companies and their users so that I can control access to the system.
- **As a sofware owner**, I want to offer this software to event management companies so that they can use it to manage their events.
- **As a sofware owner**, I want to offer online purchase of software subscription. 
- **As an event management company**, I want to manage my events and their details so that I can plan and coordinate the event.
- **As an event management company**, I want to Specify event type: domestic or international so that I can plan and coordinate the event.
- **As an event management company**, I want to manage and assign multiple venues for different wedding events so that I can plan and coordinate the event.
- **As an event management company**, I want to manage roles needed for my team so that I can delegate effectively.
- **As an event management company**, I want to see dashboard of all the events planned and executed by my team. 
- **As an event management company**, I want to Link each event with corresponding venue details (address, date, time).
- **As an event management company**, I want to Highlight shuttle pick-up zones and venue-specific info.
- **As an event management company**, I want to Embed live venue maps and directions.
- **As an event management company**, I want to Assign specific events to event managers and co-hosts with role-based access.
- **As an event management company**, I want to Role-based access for event managers, co-hosts, and staff.
- **As an event management company**, I want to Bulk event import and export via spreadsheet.
- **As an event management company**, I want to Statistics on total events, guests, RSVPs, cancellations, no-shows.
- **As an event management company**, I want to Event filtering and searching by name or status.
- **As an event management company**, I want to Assign event managers or co-hosts to one or more events with scoped visibility.

- As an event management company, I want to be able to onboard users with various roles under me so that they get access to appropriate screens and functionality. Some of the roles are event management company, event manager, event manager co-host, event host, event co-host, guest, hospitality team, vendor, etc.
- As an event management company, I want to have dashboard of all the event management companies onboarded and their events so I can monitor the events and manage them.
- As an event management company, I want to be able to manage users and their roles so I can control access to different features. Each feature should have role based access control.
- as an event management company, I should get statistics of no of events, no of guests, no of RSVPs, no of cancellations, no of no shows, etc.
- as an event management company, I should be able to export the guest list and event details to a spreadsheet so I can share it with other team members.
- As an event management company, I want to bulk import events from a spreadsheet so I can quickly set up the event list for large weddings.
- As an event management company, I want to search and filter events by name or status so I can easily find specific events.
- as an event management company, I should be able to assign one or more events to event manager / co-host and they get to see data relevant to them.


- **As an event organizer**, I want to create and manage my guest list so that I can keep track of who I've invited.
- **As an event organizer**, I want to bulk import guests from a spreadsheet so that I can add multiple guests at once.
- **As an event organizer**, I want to assign guests to one or more groups.
- **As an event organizer**, I want to group guests by family/relationship so that I can organize seating arrangements and send group communications.
- **As an event organizer**, I want to Search and filter guests by name, group, or RSVP status so that I can find specific guests or groups.

- **As an event organizer**, I want to send secure RSVP links to guests so they can easily respond to my invitation.
- **As an event organizer**, I want to track RSVP responses(attending, not attending, no response) in real-time so I can plan catering and venue requirements accurately.
- **As an event organizer**, I want to Send RSVP reminders to non-respondents.
- **As an event organizer**, I want to Allow guests to confirm or decline for themselves and their plus-ones.
- **As an event organizer**, I want to Capture plus-one names and dietary preferences.
- **As an event organizer**, I want to Allow event planners to add custom fields (e.g., VIP tags).
- **As an event organizer**, I want to Display RSVP statistics in a dashboard.
- **As an event organizer**, I want to generate a unique QR code upon RSVP confirmation and send it to the guest. This QR code will serve as their digital entry pass and can be scanned at the hospitality desk during check-in for seamless verification and attendance tracking.

- **As an event organizer**, I want to manage multiple wedding-related events in a schedule so guests know when and where to attend.
- **As an event organizer**, I want to Share personalized event schedules with guests.
- **As an event organizer**, I want to Assign and color-code guest floor preferences for easy accommodation planning.
- **As an event organizer**, I want to coordinate guest travel and accommodation details so I can arrange pickups or recommend options.
- **As an event organizer**, I want to send notifications to guests so I can update them about event details or changes.
- **As an event organizer**, I want to use WhatsApp integration for communications so I can reach guests through their preferred messaging platform.
- **As an event organizer**, I want to Allow manual update of check-in and check-out status.
- **As an event organizer**, I want to Mark guests waiting for room allocation.
- **As an event organizer**, I want to Filter guest list based on arrival time/priority for efficient room assignment.
- **As an event organizer**, I want to Manage guest travel data from both host and guest sides.
- **As an event organizer**, I want to Accept data inputs via manual entry, written notes, PDFs, or images.
- **As an event organizer**, I want to Extract and consolidate all travel data into Excel format.
- **As an event organizer**, I want to Replace old travel data with the latest submission; move older data to "Notes" column.
- **As an event organizer**, I want to Track stay arrangements and assign pick & drop logistics.
- **As an event organizer**, I want to Travel and accommodation data input from multiple sources.
- **As an event organizer**, I want to Auto-replace old travel data with notes backup.
- **As an event organizer**, I want to Artist management (import, filter, track attendance, travel/stay/logistics).
- **As an event organizer**, I want to Guest Passport Table: Guest Name, Passport No, Expiry Date, Birth Date, Address1, Address2, City, State/Region, Postal Code, Country
- **As an event organizer**, I want to Guest Arrival Details: Guest Name, Arrival Sector, Arrival Mode, Arrival Time, Arrival Date, Arrival Vehicle Number, Arrival Remarks
- **As an event organizer**, I want to Guest Departure Details: Guest Name, Departure Sector, Departure Mode, Departure Time, Departure Date, Departure Vehicle Number, Departure Remarks
- **As an event organizer**, I want to Guest Room Details: Guest Name, Hotel Name, Room Number, Check-in Date, Check-out Date, Travel Agent Detail Email, Sharer Code, Room Category, Status, Bed Type, Booking Type, Hotel Remarks
- **As an event organizer**, I want to Guest Gift Details: Guest Name, Gift Name, Gift Description, Gift Quantity, Gift Remarks
- **As an event organizer**, I want to Guest RSVP Details: Guest Name, RSVP Date, RSVP Time, RSVP Remarks
- **As an event organizer**, I want to Corporate Event Details: Corporate Event Name, Corporate Event Date, Corporate Event Time, Corporate Event Remarks
- **As an event organizer**, I want to Corporate Event Guest Details: Team, Role, Salutation, First Name, Last Name, Hotel, Room Category, Remarks, Check-in Date, Check-out Date
- **As an event organizer**, I want to Customer Meeting Details: Meeting Name, Meeting Date, Meeting Time, Meeting Remarks, Attended By, Meeting Minutes, Decisions, Actions
- **As an event organizer**, I want to Event Details Table: Event Name, Event Date, Event Time, Event Order, Event Start Time, Event End Time, Event Requirements, Event Type (Domestic Wedding, International Wedding, Corporate Event, Birthday Party, Other)

- **As an event organizer**, I want to Notify guests about driver arrival or delays.
- **As an event organizer**, I want to Send notifications for important updates or changes.
- **As an event organizer**, I want to Automate reminders for RSVP, travel updates, and event schedules.
- **As an event organizer**, I want to Send customized digital invites with embedded RSVP links.
- **As an event organizer**, I want to Provide options for animated or video invites.
- **As an event organizer**, I want to Send curated post-event photos/videos or links to Google Drive/Albums.
- **As an event organizer**, I want to Send personalized thank you messages via email or WhatsApp based on attendance.
- **As an event organizer**, I want to Provide automated IVR voice call support for elderly or non-tech-savvy guests.
- **As an event organizer**, I want to Provide a chatbot for instant guest queries.
- **As an event organizer**, I want to Real-time check-in/check-out status management.
- **As an event organizer**, I want to Automate answers for common questions on :
   Event timings
   Dress codes (wardrobe planner)
   Venue directions
   Access & Security

- **As an event host**, I want to upload my guest list so that event management company can work with my guest list.
- **As an event host**, I want to assign guests to one or more groups.
- **As an event host**, I want to group guests by family/relationship so that I can organize seating arrangements and send group communications.
- **As an event host**, I want to Search and filter guests by name, group, or RSVP status so that I can find specific guests or groups.
- **As an event host**, I want to Customize guest lists based on specific functions (e.g., mehndi, sangeet, wedding).
- **As an event host**, I want to Add custom columns for number and type of functions invited.

- **As an event guest**, I want to easily respond to my RSVP invitation so the hosts know if I'm attending.
- **As an event guest**, I want to provide travel and accommodation details so hosts can assist with arrangements if needed.




## 4. Functional Requirements

1. **Guest Management**
   1.1. The system must allow users to add, edit, and delete guests
   1.2. The system must support bulk import of guests from CSV/Excel
   1.3. The system must capture guest details including name, email, phone, and group association
   1.4. The system must provide search and filtering capabilities for the guest list

2. **Group Management**
   2.1. The system must allow users to create and manage guest groups
   2.2. The system must enable assigning guests to specific groups
   2.3. The system must allow bulk actions on groups (notifications, assignments)

3. **RSVP Management**
   3.1. The system must generate unique, secure tokens for each guest's RSVP
   3.2. The system must provide a dashboard showing RSVP status summaries
   3.3. The system must track individual RSVP responses (attending, not attending, pending)
   3.4. The system must allow guests to update their RSVP status through secure links

4. **Event Management**
   4.1. The system must support creating multiple events within a wedding
   4.2. The system must track event details including name, description, start/end times
   4.3. The system must allow assigning guests to specific events
   4.4. The system must provide a calendar/timeline view of all events


4. **User Management**
   ability to create users (event organizer, event host, event guest)
   ability to assign roles to users (event organizer, event host, event guest)
   ability to assign permissions to users (event organizer, event host, event guest)   

4. **Role based access control**
   4.1. The system must support role based access control to different roles within the software

   

5. **Logistics Management**
   5.1. The system must track guest travel information (mode, arrival times)
   5.2. The system must manage stay arrangements for out-of-town guests
   5.3. The system must coordinate pick-up and drop services for guests
   5.4. The system must provide reports on logistics requirements

6. **Notifications**
   6.1. The system must support email notifications to guests
   6.2. The system must support SMS notifications to guests
   6.3. The system must enable WhatsApp integration for messaging
   6.4. The system must provide templates for common notification scenarios
   6.5. The system must track message delivery status

7. **Dashboard and Reporting**
   7.1. The system must provide an overview dashboard showing key metrics
   7.2. The system must generate reports on guest status, group distributions, and RSVP rates
   7.3. The system must visualize data through charts and graphs

8. **Admin Functions**
   8.1. The system must provide secure login for administrators
   8.2. The system must support default admin credentials (admin/admin)
   8.3. The system must include user management capabilities

9. **Chatbot/FAQ**
   9.1. The system must provide an automated chatbot to answer common guest questions
   9.2. The system must allow customization of FAQ responses

10. **WhatsApp Integration**
    10.1. The system must connect with WhatsApp API for messaging
    10.2. The system must support template messages for WhatsApp
    10.3. The system must track WhatsApp message status

## 5. Non-Goals (Out of Scope)

1. Payment processing for wedding gifts or contributions
2. Photography/video management or sharing
3. Wedding venue booking or vendor management
4. Wedding website creation (though sharing links to existing websites is supported)
5. Social media integration beyond WhatsApp
6. Guest mobile application (focusing on web-based solution only)
7. Multi-language support for the initial release
8. Gift registry integration

## 6. Design Considerations

- The application uses Material UI and Bootstrap for a clean, modern, responsive design
- The dashboard layout provides easy navigation to all major sections
- The interface should be intuitive for users with minimal technical experience
- Mobile responsiveness is essential for both admin and guest interfaces
- Color scheme should be customizable to match wedding themes

## 7. Technical Considerations

- **Frontend**: React.js with Material UI and Bootstrap components
- **Backend**: Flask (Python) REST API
- **Database**: SQLite for development, MySQL for production
- **Authentication**: Simple username/password for admin access, token-based for guest RSVP links
- **APIs**: WhatsApp Business API integration for messaging
- **Deployment**: Containerized deployment recommended for scalability
- **Testing**: Unit tests for both frontend and backend components

## 8. Success Metrics

- 90%+ RSVP response rate (compared to industry average of ~70-80%)
- Reduction in time spent on guest management by 50%
- Improved guest satisfaction through streamlined RSVP process
- 80%+ of guests providing complete travel and logistics information
- Reduction in manual communications needed by 60%
- High adoption rate of WhatsApp communications (70%+ of guests)

## 9. Open Questions

1. Should the system support multiple weddings/events for the same administrator? - yes
2. What level of customization should be allowed for the RSVP forms? - minimal
3. How can we handle guests without email addresses or smartphones? - phone number is mandatory
4. What data retention policies should be implemented after the event? - 30 days event , guest and RSVP data retention. Retain data of artists and vendors for 2 years 
5. How can we scale the WhatsApp integration for very large guest lists? - restrict it to 1000 guests
6. Should we add support for dietary preferences and meal selection in the RSVP process? - yes


## 1. Branding and UI Improvements

- Implement consistent branding with custom logo and color scheme (purple primary color as shown)
- Add wedding name and date header across all pages (`sapna weds alok • Thursday, July 3, 2025`)
- Create a dedicated event tag/identifier system (e.g., `#swapalok` hashtag shown in dropdown)
- Add "Contact Us" WhatsApp button in header
- Include "Refresh Data" button for real-time updates
- Create consistent purple action buttons and white/outlined secondary buttons
- Add clear breadcrumb navigation in header

## 2. Logistics Management Enhancements

### Pick-up & Drop
- Add dedicated driver management with fields:
  - Driver name
  - Driver phone number
  - Car/vehicle number
  - Pickup status tracking
- Implement status filtering dropdown
- Add guest selection checkboxes for bulk actions

### Stay Arrangements
- Add hotel management with fields:
  - Hotel name
  - Room number
  - ID status (for check-in)
  - Remarks field for special requests
- Implement dual filter system (Room Status and ID Status)
- Add N/A indicators for unassigned fields

### Travel Info
- Implement comprehensive travel tracking:
  - Arrival mode dropdown (train/flight/bus/car)
  - Vehicle number field
  - Arrival time selector with date/time picker
  - Departure mode tracking
- Add multi-parameter filtering system
- Create status selection dropdowns for each travel mode

## 3. Notification System Enhancements

- Create multi-channel notification system:
  - Email integration
  - WhatsApp integration with direct API
- Implement predefined message templates:
  - Invite guests
  - Request RSVP
  - Get Travel Info
  - Collect IDs
  - Request Pictures
  - Send Thanks
  - Custom message option
- Add group targeting functionality:
  - Everyone (default)
  - Bride Side
  - Groom Side
  - Custom groups
- Include file attachment capability (with 15MB limit)

## 4. RSVP Management Improvements

- Create dedicated RSVP tracking dashboard
- Add event-specific RSVP filtering
- Implement guest name search functionality
- Add wedding event association for each RSVP

## 5. Technical Enhancements

- Add real-time data refresh capability
- Implement search functionality across all modules
- Create consistent filter patterns across all sections
- Build responsive design with mobile optimization
- Implement secure authentication with passphrase option

