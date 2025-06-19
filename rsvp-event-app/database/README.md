# RSVP Event Application Database

## Overview
This directory contains the SQLite database for the RSVP Event Application. The database structure is defined in `schema.sql` and implemented in the `rsvp_events.db` file.

## Database Schema

### Tables
The database includes the following tables:

#### Users and Authentication
- **users**: User accounts and profiles
- **roles**: System roles (admin, event_manager, etc.)
- **user_roles**: Mapping between users and roles
- **permissions**: System permissions
- **role_permissions**: Mapping between roles and permissions

#### Event Management
- **events**: Event details
- **event_venues**: Venues for events
- **event_schedules**: Event schedules and agendas

#### Guest Management
- **guests**: Guest information
- **guest_groups**: Groups of guests
- **guest_group_members**: Guests assigned to groups

#### RSVP Management
- **rsvp_invitations**: Event invitations
- **rsvp_responses**: Guest responses to invitations
- **rsvp_plus_ones**: Additional guests

#### Logistics Management
- **accommodations**: Accommodation details
- **guest_accommodations**: Guest accommodation assignments
- **transportation**: Transportation options

### Relationships
![Database Relationships](./database_relationships.png)

### Default Data
- Pre-defined roles (admin, event_manager, event_host, guest, hospitality, vendor)
- Default admin user (username: admin, password: admin123) - **Please change after first login**

## Usage
To connect to this database in the application, use the provided database connection helpers in `backend/db/sqlite.js`.

## Maintenance

### Backing Up the Database
```bash
sqlite3 rsvp_events.db .dump > backup_$(date +%Y%m%d).sql
```

### Restoring from a Backup
```bash
sqlite3 rsvp_events.db < backup_file.sql
```

### Viewing Database Structure
```bash
sqlite3 rsvp_events.db .schema
```
