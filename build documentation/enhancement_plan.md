# RSVP Application Enhancement Plan

Based on the WedHaven screenshots, here are functional enhancements to implement in our RSVP2 application:

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

## 6. Database Schema Updates

```sql
-- Add driver management table
CREATE TABLE drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    car_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'available'
);

-- Update logistics table with new fields
ALTER TABLE logistics ADD COLUMN driver_id INTEGER REFERENCES drivers(id);
ALTER TABLE logistics ADD COLUMN room_number VARCHAR(20);
ALTER TABLE logistics ADD COLUMN hotel_name VARCHAR(255);
ALTER TABLE logistics ADD COLUMN id_status VARCHAR(20);
ALTER TABLE logistics ADD COLUMN remarks TEXT;
ALTER TABLE logistics ADD COLUMN vehicle_number VARCHAR(50);
ALTER TABLE logistics ADD COLUMN departure_mode VARCHAR(50);

-- Add notification templates and groups
CREATE TABLE notification_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE guest_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) -- 'bride_side', 'groom_side', 'custom'
);

-- Insert default templates
INSERT INTO notification_templates (name, content) VALUES
('Invite guests', 'Dear {guest_name}, you are cordially invited to {wedding_name} on {wedding_date}.'),
('Request RSVP', 'Dear {guest_name}, please RSVP for {wedding_name} by clicking on this link: {rsvp_link}'),
('Get Travel Info', 'Dear {guest_name}, please share your travel details for {wedding_name}.'),
('Collect IDs', 'Dear {guest_name}, please share ID details for hotel check-in at {wedding_name}.'),
('Request Pictures', 'Dear {guest_name}, please share your pictures from {wedding_name}.'),
('Send Thanks', 'Dear {guest_name}, thank you for attending {wedding_name}.');
```

## 7. API Endpoint Additions

```python
# New endpoints for driver management
@app.route('/api/drivers', methods=['GET', 'POST', 'PUT', 'DELETE'])

# Enhanced logistics endpoints
@app.route('/api/logistics/pickup', methods=['GET', 'POST', 'PUT'])
@app.route('/api/logistics/stay', methods=['GET', 'POST', 'PUT'])
@app.route('/api/logistics/travel', methods=['GET', 'POST', 'PUT'])

# Notification system endpoints
@app.route('/api/notifications/templates', methods=['GET', 'POST'])
@app.route('/api/notifications/groups', methods=['GET', 'POST'])
@app.route('/api/notifications/whatsapp', methods=['POST'])
@app.route('/api/notifications/email', methods=['POST'])
```

## 8. Frontend Component Additions

```jsx
// New components to create
// Driver management component
const DriverManagement = () => {...}

// Enhanced notification system
const NotificationSystem = () => {...}

// Enhanced RSVP status dashboard
const EnhancedRSVPDashboard = () => {...}

// Status filter components
const StatusFilter = ({ options, onChange }) => {...}

// Multi-parameter filter component
const MultiFilter = ({ filters, onChange }) => {...}

// Event tag/hashtag component
const EventTag = ({ tag, onChange }) => {...}
```

## 9. Integration Requirements

1. WhatsApp Business API integration for direct messaging
2. Email service provider integration 
3. Date/time picker library integration
4. File upload and attachment handling
5. Real-time data refresh mechanism
6. Search indexing for quick filtering

## 10. Implementation Priority

1. Database schema updates
2. Backend API endpoint additions
3. UI component enhancements
4. Notification system implementation
5. Logistics management enhancements
6. RSVP management improvements
7. Integration with external services
8. Testing and refinement
