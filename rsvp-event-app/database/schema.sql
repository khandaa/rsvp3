-- RSVP Event Application Database Schema
-- Version: 2.0
-- Created: 2025-06-19

PRAGMA foreign_keys = ON;

-- Users and Authentication
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    profile_image_url TEXT,
    status TEXT CHECK(status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(name IN ('admin', 'event_manager', 'event_host', 'guest', 'hospitality', 'vendor')),
    description TEXT,
    permissions TEXT, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

CREATE TABLE permissions (
    permission_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_permission_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Event Management
CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    event_description TEXT,
    event_type TEXT CHECK(type IN ('wedding', 'corporate', 'birthday', 'other')),
    event_start_datetime TIMESTAMP NOT NULL,
    event_end_datetime TIMESTAMP NOT NULL,
    timezone TEXT,
    event_status TEXT CHECK(status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',
    is_recurring BOOLEAN DEFAULT 0,
    recurrence_pattern TEXT CHECK(recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
    created_by INTEGER NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_venues (
    venue_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    latitude REAL,
    longitude REAL,
    is_primary BOOLEAN DEFAULT 0,
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_schedules (
    schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    location TEXT,
    is_break BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest Management
CREATE TABLE guests (
    guest_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    date_of_birth DATE,
    gender TEXT,
    is_vip BOOLEAN DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guest_groups (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guest_group_members (
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES guest_groups(group_id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, guest_id)
);

-- RSVP Management
CREATE TABLE rsvp_invitations (
    invitation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
    invitation_token TEXT UNIQUE,
    invitation_sent_at TIMESTAMP,
    invitation_opened_at TIMESTAMP,
    status TEXT CHECK(status IN ('pending', 'sent', 'viewed', 'responded')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, guest_id)
);

CREATE TABLE rsvp_responses (
    response_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invitation_id INTEGER NOT NULL REFERENCES rsvp_invitations(invitation_id) ON DELETE CASCADE,
    guest_id INTEGER NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
    response_status TEXT CHECK(response_status IN ('attending', 'not_attending', 'maybe')),
    response_date TIMESTAMP,
    number_of_guests INTEGER DEFAULT 1,
    plus_ones_allowed INTEGER DEFAULT 0,
    plus_ones_count INTEGER DEFAULT 0,
    dietary_restrictions TEXT,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(invitation_id, guest_id)
);

CREATE TABLE rsvp_plus_ones (
    plus_one_id INTEGER PRIMARY KEY AUTOINCREMENT,
    response_id INTEGER NOT NULL REFERENCES rsvp_responses(response_id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    dietary_restrictions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logistics Management
CREATE TABLE accommodations (
    accommodation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('hotel', 'airbnb', 'other')),
    address TEXT,
    check_in_date DATE,
    check_out_date DATE,
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guest_accommodations (
    guest_accommodation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
    accommodation_id INTEGER NOT NULL REFERENCES accommodations(accommodation_id) ON DELETE CASCADE,
    room_number TEXT,
    check_in_date DATE,
    check_out_date DATE,
    status TEXT CHECK(status IN ('booked', 'checked_in', 'checked_out', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(guest_id, accommodation_id)
);

CREATE TABLE transportation (
    transportation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    type TEXT CHECK(type IN ('shuttle', 'taxi', 'limo', 'other')),
    description TEXT,
    departure_location TEXT,
    departure_datetime TIMESTAMP,
    arrival_location TEXT,
    arrival_datetime TIMESTAMP,
    capacity INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_event_venues_event_id ON event_venues(event_id);
CREATE INDEX idx_event_schedules_event_id ON event_schedules(event_id);
CREATE INDEX idx_guest_groups_event_id ON guest_groups(event_id);
CREATE INDEX idx_guest_group_members_group_id ON guest_group_members(group_id);
CREATE INDEX idx_guest_group_members_guest_id ON guest_group_members(guest_id);
CREATE INDEX idx_rsvp_invitations_event_id ON rsvp_invitations(event_id);
CREATE INDEX idx_rsvp_invitations_guest_id ON rsvp_invitations(guest_id);
CREATE INDEX idx_rsvp_responses_invitation_id ON rsvp_responses(invitation_id);
CREATE INDEX idx_rsvp_responses_guest_id ON rsvp_responses(guest_id);
CREATE INDEX idx_rsvp_plus_ones_response_id ON rsvp_plus_ones(response_id);
CREATE INDEX idx_accommodations_event_id ON accommodations(event_id);
CREATE INDEX idx_guest_accommodations_guest_id ON guest_accommodations(guest_id);
CREATE INDEX idx_guest_accommodations_accommodation_id ON guest_accommodations(accommodation_id);
CREATE INDEX idx_transportation_event_id ON transportation(event_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_users_updated_at
AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = NEW.user_id;
END;

CREATE TRIGGER update_events_updated_at
AFTER UPDATE ON events
BEGIN
    UPDATE events SET updated_at = CURRENT_TIMESTAMP WHERE event_id = NEW.event_id;
END;

-- Add more triggers for other tables as needed...

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES 
('admin', 'System administrator with full access', '{"all": true}'),
('event_manager', 'Can create and manage events', '{"events": ["create", "read", "update", "delete"], "guests": ["create", "read", "update", "delete"]}'),
('event_host', 'Can manage specific events they are assigned to', '{"events": ["read", "update"], "guests": ["read", "update"]}'),
('guest', 'Can view event details and RSVP', '{"events": ["read"], "rsvp": ["create", "update"]}'),
('hospitality', 'Can manage guest accommodations and transportation', '{"accommodations": ["create", "read", "update"], "transportation": ["create", "read", "update"]}'),
('vendor', 'Can view event details they are assigned to', '{"events": ["read"]}');

-- Create a default admin user (password: admin123 - should be changed after first login)
-- Note: In a production environment, use proper password hashing
INSERT INTO users (username, email, password_hash, first_name, last_name, status) 
VALUES ('admin', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Administrator', 'active');

-- Assign admin role to the default admin user
INSERT INTO user_roles (user_id, role_id) 
VALUES (1, (SELECT role_id FROM roles WHERE name = 'admin'));
