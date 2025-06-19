const { db, runQuery, getOne, getAll } = require('../db/sqlite');

class UserModel {
  // Get all users
  static async getAllUsers() {
    return await getAll(
      'SELECT user_id, username, email, first_name, last_name, phone, profile_image_url, status, last_login_at, created_at, updated_at FROM users'
    );
  }
  
  // Get user by ID
  static async getUserById(userId) {
    return await getOne(
      'SELECT user_id, username, email, first_name, last_name, phone, profile_image_url, status, last_login_at, created_at, updated_at FROM users WHERE user_id = ?',
      [userId]
    );
  }
  
  // Get user by username
  static async getUserByUsername(username) {
    return await getOne(
      'SELECT user_id, username, email, first_name, last_name, phone, profile_image_url, status, last_login_at, created_at, updated_at FROM users WHERE username = ?',
      [username]
    );
  }
  
  // Get user with password (for authentication)
  static async getUserForAuth(username) {
    return await getOne(
      'SELECT user_id, username, email, password_hash, first_name, last_name, status FROM users WHERE username = ? AND status = "active"',
      [username]
    );
  }
  
  // Create new user
  static async createUser(userData) {
    const { username, email, password_hash, first_name, last_name, phone, profile_image_url } = userData;
    
    return await runQuery(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, phone, profile_image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, password_hash, first_name, last_name, phone, profile_image_url]
    );
  }
  
  // Update user
  static async updateUser(userId, userData) {
    const { username, email, first_name, last_name, phone, profile_image_url, status } = userData;
    
    return await runQuery(
      `UPDATE users 
       SET username = ?, email = ?, first_name = ?, last_name = ?, 
           phone = ?, profile_image_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [username, email, first_name, last_name, phone, profile_image_url, status, userId]
    );
  }
  
  // Update user's password
  static async updatePassword(userId, passwordHash) {
    return await runQuery(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [passwordHash, userId]
    );
  }
  
  // Delete user
  static async deleteUser(userId) {
    return await runQuery('DELETE FROM users WHERE user_id = ?', [userId]);
  }
  
  // Update last login time
  static async updateLastLogin(userId) {
    return await runQuery(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [userId]
    );
  }
  
  // Get user roles
  static async getUserRoles(userId) {
    return await getAll(
      `SELECT r.role_id, r.name, r.description, r.permissions
       FROM roles r
       JOIN user_roles ur ON r.role_id = ur.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );
  }
}

module.exports = UserModel;
