-- MySQL Script generated for RSVP Event Management System
-- Database: rsvp_db

-- Create database
CREATE DATABASE IF NOT EXISTS rsvp_db;
USE rsvp_db;

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    role_description TEXT,
    role_permissions TEXT,
    role_status ENUM('active', 'inactive') DEFAULT 'active',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    UNIQUE KEY uk_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role_id INT NOT NULL,
    user_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100),
    last_login TIMESTAMP NULL,
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email),
    CONSTRAINT fk_user_role FOREIGN KEY (user_role_id) REFERENCES user_roles(role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Login History
CREATE TABLE IF NOT EXISTS user_login (
    login_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    CONSTRAINT fk_user_login FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_user_session FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Weddings Table
CREATE TABLE IF NOT EXISTS weddings (
    wedding_id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_name VARCHAR(255) NOT NULL,
    wedding_description TEXT,
    wedding_date DATE NOT NULL,
    primary_contact_name VARCHAR(100) NOT NULL,
    primary_contact_email VARCHAR(100) NOT NULL,
    primary_contact_phone VARCHAR(20) NOT NULL,
    status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_wedding_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_wedding_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    venue_name VARCHAR(255),
    venue_address TEXT,
    event_type ENUM('ceremony', 'reception', 'mehndi', 'sangeet', 'rehearsal_dinner', 'other') NOT NULL,
    event_status ENUM('scheduled', 'postponed', 'cancelled', 'completed') DEFAULT 'scheduled',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_event_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(wedding_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_event_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guests Table
CREATE TABLE IF NOT EXISTS guests (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    family_reference VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    salutation VARCHAR(20),
    relation VARCHAR(100),
    phone_number VARCHAR(20),
    email_address VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state_region VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    is_primary_guest BOOLEAN DEFAULT TRUE,
    plus_ones_allowed INT DEFAULT 0,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_guest_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(wedding_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_guest_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guest Passport Details
CREATE TABLE IF NOT EXISTS guest_passports (
    passport_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    passport_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    birth_date DATE,
    nationality VARCHAR(100),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_guest_passport FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_passport_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_passport_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guest Arrival Details
CREATE TABLE IF NOT EXISTS guest_arrivals (
    arrival_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    arrival_sector VARCHAR(100),
    arrival_mode ENUM('flight', 'train', 'bus', 'car', 'other') NOT NULL,
    arrival_date DATE NOT NULL,
    arrival_time TIME,
    flight_train_number VARCHAR(50),
    arrival_vehicle_number VARCHAR(50),
    arrival_remarks TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_guest_arrival FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_arrival_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_arrival_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guest Departure Details
CREATE TABLE IF NOT EXISTS guest_departures (
    departure_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    departure_sector VARCHAR(100),
    departure_mode ENUM('flight', 'train', 'bus', 'car', 'other') NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME,
    flight_train_number VARCHAR(50),
    departure_vehicle_number VARCHAR(50),
    departure_remarks TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_guest_departure FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_departure_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_departure_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guest Room Details
CREATE TABLE IF NOT EXISTS guest_rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    hotel_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(50),
    room_category VARCHAR(100),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    bed_type ENUM('single', 'double', 'twin', 'queen', 'king', 'suite') NOT NULL,
    booking_status ENUM('confirmed', 'waiting', 'cancelled') DEFAULT 'confirmed',
    booking_reference VARCHAR(100),
    travel_agent_detail TEXT,
    sharer_code VARCHAR(50),
    room_remarks TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_guest_room FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_room_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_room_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guest Gift Details
CREATE TABLE IF NOT EXISTS guest_gifts (
    gift_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    gift_name VARCHAR(255) NOT NULL,
    gift_description TEXT,
    gift_quantity INT DEFAULT 1,
    gift_remarks TEXT,
    received_date DATE,
    acknowledged BOOLEAN DEFAULT FALSE,
    thank_you_sent BOOLEAN DEFAULT FALSE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_guest_gift FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_gift_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_gift_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Groups Table
CREATE TABLE IF NOT EXISTS `groups` (
    group_id INT AUTO_INCREMENT PRIMARY KEY,
    wedding_id INT NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    group_description TEXT,
    group_status ENUM('active', 'inactive') DEFAULT 'active',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_group_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(wedding_id) ON DELETE CASCADE,
    CONSTRAINT fk_group_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_group_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Group Guests Mapping
CREATE TABLE IF NOT EXISTS group_guests (
    group_guest_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    guest_id INT NOT NULL,
    is_primary_contact BOOLEAN DEFAULT FALSE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    UNIQUE KEY uk_group_guest (group_id, guest_id),
    CONSTRAINT fk_group_guest_group FOREIGN KEY (group_id) REFERENCES `groups`(group_id) ON DELETE CASCADE,
    CONSTRAINT fk_group_guest_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_group_guest_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_group_guest_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event Guests Mapping
CREATE TABLE IF NOT EXISTS event_guests (
    event_guest_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_id INT NOT NULL,
    invitation_sent BOOLEAN DEFAULT FALSE,
    invitation_sent_date DATETIME,
    rsvp_status ENUM('pending', 'accepted', 'declined', 'tentative') DEFAULT 'pending',
    rsvp_date DATETIME,
    additional_notes TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    UNIQUE KEY uk_event_guest (event_id, guest_id),
    CONSTRAINT fk_event_guest_event FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_guest_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_guest_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_event_guest_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RSVP Tokens
CREATE TABLE IF NOT EXISTS rsvp_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    token_value VARCHAR(255) NOT NULL,
    token_expiry DATETIME NOT NULL,
    token_status ENUM('active', 'used', 'expired') DEFAULT 'active',
    last_accessed DATETIME,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    UNIQUE KEY uk_token_value (token_value),
    CONSTRAINT fk_rsvp_token_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_token_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_token_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
    template_id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    template_subject VARCHAR(255) NOT NULL,
    template_content TEXT NOT NULL,
    template_type ENUM('email', 'sms', 'whatsapp') NOT NULL,
    template_variables TEXT,
    status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    UNIQUE KEY uk_template_name (template_name, template_type),
    CONSTRAINT fk_template_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_template_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    template_id INT,
    notification_type ENUM('email', 'sms', 'whatsapp', 'system') NOT NULL,
    notification_subject VARCHAR(255),
    notification_message TEXT NOT NULL,
    notification_status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
    sent_time DATETIME,
    delivered_time DATETIME,
    error_message TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_notification_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_template FOREIGN KEY (template_id) REFERENCES notification_templates(template_id) ON DELETE SET NULL,
    CONSTRAINT fk_notification_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_notification_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- WhatsApp Messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    template_id INT,
    message_content TEXT NOT NULL,
    message_status ENUM('pending', 'sent', 'delivered', 'read', 'failed') DEFAULT 'pending',
    message_type ENUM('text', 'template', 'media') NOT NULL,
    media_url VARCHAR(255),
    sent_time DATETIME,
    delivered_time DATETIME,
    read_time DATETIME,
    error_message TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_whatsapp_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_whatsapp_template FOREIGN KEY (template_id) REFERENCES notification_templates(template_id) ON DELETE SET NULL,
    CONSTRAINT fk_whatsapp_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_whatsapp_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Logistics
CREATE TABLE IF NOT EXISTS logistics (
    logistics_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    logistics_type ENUM('transportation', 'accommodation', 'itinerary', 'other') NOT NULL,
    logistics_status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    start_datetime DATETIME,
    end_datetime DATETIME,
    pickup_location TEXT,
    dropoff_location TEXT,
    assigned_to INT,
    logistics_comments TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_logistics_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_logistics_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_logistics_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_logistics_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transportation
CREATE TABLE IF NOT EXISTS transportation (
    transport_id INT AUTO_INCREMENT PRIMARY KEY,
    logistics_id INT NOT NULL,
    transportation_type ENUM('flight', 'train', 'bus', 'car', 'taxi', 'other') NOT NULL,
    vehicle_details VARCHAR(255),
    driver_name VARCHAR(100),
    driver_contact VARCHAR(20),
    pickup_time DATETIME,
    dropoff_time DATETIME,
    pickup_location TEXT,
    dropoff_location TEXT,
    status ENUM('scheduled', 'in_transit', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_transportation_logistics FOREIGN KEY (logistics_id) REFERENCES logistics(logistics_id) ON DELETE CASCADE,
    CONSTRAINT fk_transportation_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_transportation_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dietary Preferences
CREATE TABLE IF NOT EXISTS dietary_preferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    preference_name VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_preference_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_preference_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Guest Dietary Preferences
CREATE TABLE IF NOT EXISTS guest_dietary_preferences (
    guest_preference_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    preference_id INT NOT NULL,
    comments TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    UNIQUE KEY uk_guest_preference (guest_id, preference_id),
    CONSTRAINT fk_guest_preference_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_preference_pref FOREIGN KEY (preference_id) REFERENCES dietary_preferences(preference_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_pref_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_guest_pref_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQ Categories
CREATE TABLE IF NOT EXISTS faq_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_faq_category_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_faq_category_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQ Table
CREATE TABLE IF NOT EXISTS faqs (
    faq_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_faq_category FOREIGN KEY (category_id) REFERENCES faq_categories(category_id) ON DELETE SET NULL,
    CONSTRAINT fk_faq_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_faq_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chatbot Responses
CREATE TABLE IF NOT EXISTS chatbot_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,
    response_text TEXT NOT NULL,
    response_type ENUM('text', 'suggestion', 'redirect') DEFAULT 'text',
    redirect_url VARCHAR(255),
    display_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    CONSTRAINT fk_chatbot_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT fk_chatbot_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    old_values JSON,
    new_values JSON,
    CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_guest_wedding ON guests(wedding_id);
CREATE INDEX idx_event_wedding ON events(wedding_id);
CREATE INDEX idx_group_wedding ON `groups`(wedding_id);
CREATE INDEX idx_rsvp_token_guest ON rsvp_tokens(guest_id);
CREATE INDEX idx_notification_guest ON notifications(guest_id);
CREATE INDEX idx_whatsapp_guest ON whatsapp_messages(guest_id);
CREATE INDEX idx_logistics_guest ON logistics(guest_id);
CREATE INDEX idx_audit_log_user ON audit_logs(user_id);
CREATE INDEX idx_audit_log_table ON audit_logs(table_name, record_id);

-- Insert default user roles
INSERT INTO user_roles (role_name, role_description, role_permissions, role_status)
VALUES 
('super_admin', 'Super Administrator', 'all', 'active'),
('admin', 'Administrator', 'manage_users,manage_events,manage_guests,manage_rsvps,manage_notifications', 'active'),
('event_planner', 'Event Planner', 'manage_events,manage_guests,manage_rsvps', 'active'),
('guest_services', 'Guest Services', 'view_guests,manage_rsvps', 'active'),
('guest', 'Guest', 'view_own_rsvp,update_own_rsvp', 'active');

-- Create default admin user (password: admin123)
-- Note: In production, use a secure password hashing function
INSERT INTO users (username, email, password_hash, user_role_id, user_status)
SELECT 'admin', 'admin@example.com', '$2a$12$8XJ1hZ5q5X5Z5X5Z5X5Z5OeX5Z5X5Z5X5Z5X5Z5X5Z5X5Z5X5Z5', role_id, 'active'
FROM user_roles WHERE role_name = 'super_admin';

-- Insert some default dietary preferences
INSERT INTO dietary_preferences (preference_name, description, status)
VALUES 
('Vegetarian', 'No meat, fish, or poultry', 'active'),
('Vegan', 'No animal products including dairy and eggs', 'active'),
('Gluten-Free', 'No gluten-containing ingredients', 'active'),
('Nut Allergy', 'No nuts or nut products', 'active'),
('Lactose Intolerant', 'No dairy products', 'active'),
('Halal', 'Food prepared according to Islamic law', 'active'),
('Kosher', 'Food prepared according to Jewish dietary laws', 'active'),
('No Restrictions', 'No dietary restrictions', 'active');

-- Insert some default FAQ categories
INSERT INTO faq_categories (category_name, description, display_order, status)
VALUES 
('General', 'General questions about the event', 1, 'active'),
('RSVP', 'Questions about RSVP process', 2, 'active'),
('Accommodation', 'Questions about accommodation', 3, 'active'),
('Transportation', 'Questions about transportation', 4, 'active'),
('Dress Code', 'Questions about what to wear', 5, 'active'),
('Gifts', 'Questions about gifts and registry', 6, 'active');

-- Insert some default FAQ entries
INSERT INTO faqs (category_id, question, answer, display_order, status)
SELECT category_id, 
       'When is the RSVP deadline?', 
       'Please RSVP by [insert date] so we can make the necessary arrangements.', 
       1, 
       'active'
FROM faq_categories WHERE category_name = 'RSVP';

INSERT INTO faqs (category_id, question, answer, display_order, status)
SELECT category_id, 
       'Can I bring a plus one?', 
       'Your invitation will specify if you are allowed a plus one. If you have any questions, please contact us.', 
       2, 
       'active'
FROM faq_categories WHERE category_name = 'RSVP';

-- Insert some default chatbot responses
INSERT INTO chatbot_responses (keyword, response_text, response_type, status)
VALUES 
('hello', 'Hello! How can I assist you today?', 'text', 'active'),
('hi', 'Hi there! How can I help you with the event?', 'text', 'active'),
('rsvp', 'You can RSVP by clicking on the RSVP link in your invitation email or by visiting our RSVP page.', 'text', 'active'),
('dress code', 'The dress code for the event is [insert dress code].', 'text', 'active'),
('directions', 'The event will be held at [venue name]. You can find directions on the venue''s website or by using a maps application.', 'text', 'active');
