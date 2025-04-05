import { masterDb, slaveDb } from "../core/database.js";
import { encryptPassword } from '../utils/hash.js';

class User {
    constructor() {
        this.master = masterDb;
        this.slave = slaveDb;
    }

    /**
     * Create a new user.
     * @param {string} username - The username of the user.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @param {string} birthDate - The birth date of the user.
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async create(username, email, password, birthdate) {
        try {
            // Check if the username or email already exists
            const [existingUser] = await this.slave.execute(
                'SELECT username, email FROM users WHERE username = ? OR email = ?',
                [username, email]
            );

            if (existingUser.length > 0) {
                if (existingUser[0].username === username) {
                    throw new Error('Username already exists');
                } else if (existingUser[0].email === email) {
                    throw new Error('Email already exists');
                }
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@\d]+\.[^\d\s@]+/;
            if (!emailRegex.test(email)) {
                throw new Error('Invalid email');
            }

            // Hash the password
            const hashPassword = encryptPassword(password);

            // Insert the new user into the database
            const [result] = await this.master.execute(
                'INSERT INTO users (username, email, password, birth_date, user_balance) VALUES (?, ?, ?, ?, ?)',
                [username, email, hashPassword, birthdate, 0.00] // Default balance is 0.00
            );

            return result;
        } catch (err) {
            console.error('<error> user.create', err);
            throw err;
        }
    }

    /**
     * Verify user credentials.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise<Object>} - The user object if credentials are valid.
     */
    async verify(username, password) {
        try {
            const hashPassword = encryptPassword(password);

            const [result] = await this.slave.execute(
                'SELECT user_id, username, email, user_balance FROM users WHERE username = ? AND password = ?',
                [username, hashPassword]
            );

            if (result.length === 0) {
                throw new Error('Invalid username or password');
            }

            return result[0];
        } catch (err) {
            console.error('<error> user.verify', err);
            throw err;
        }
    }

    /**
     * Get user information by username.
     * @param {string} username - The username of the user.
     * @returns {Promise<Object>} - The user object.
     */
    async getUser(username) {
        try {
            const [result] = await this.slave.execute(
                'SELECT user_id, username, email, birth_date, user_balance FROM users WHERE username = ?',
                [username]
            );

            if (result.length === 0) {
                throw new Error('User not found');
            }

            return result[0];
        } catch (err) {
            console.error('<error> user.getUser', err);
            throw err;
        }
    }

    /**
     * Update user information.
     * @param {string} currentUsername - The current username of the user.
     * @param {string} newUsername - The new username (optional).
     * @param {string} currentPassword - The current password (optional).
     * @param {string} newPassword - The new password (optional).
     * @param {string} email - The new email (optional).
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async updateUser(currentUsername, newUsername, currentPassword, newPassword, email) {
        try {
            const fieldsToUpdate = [];
            const values = [];

            // Validate current password if changing password
            if (newPassword) {
                const [user] = await this.slave.execute(
                    'SELECT password FROM users WHERE username = ?',
                    [currentUsername]
                );

                if (user.length === 0 || encryptPassword(currentPassword) !== user[0].password) {
                    throw new Error('Current password is incorrect');
                }

                const hashPassword = encryptPassword(newPassword);
                fieldsToUpdate.push('password = ?');
                values.push(hashPassword);
            }

            // Add new username if provided
            if (newUsername) {
                fieldsToUpdate.push('username = ?');
                values.push(newUsername);
            }

            // Add new email if provided
            if (email) {
                fieldsToUpdate.push('email = ?');
                values.push(email);
            }

            // Update the user if there are fields to update
            if (fieldsToUpdate.length > 0) {
                values.push(currentUsername);

                const [result] = await this.master.execute(
                    `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE username = ?`,
                    values
                );

                return result;
            } else {
                throw new Error('No fields to update');
            }
        } catch (err) {
            console.error('<error> user.updateUser', err);
            throw err;
        }
    }

    /**
     * Delete a user by username.
     * @param {string} username - The username of the user to delete.
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async deleteUser(username) {
        try {
            const [result] = await this.master.execute(
                'DELETE FROM users WHERE username = ?',
                [username]
            );

            if (result.affectedRows === 0) {
                throw new Error('User not found');
            }

            return result;
        } catch (err) {
            console.error('<error> user.deleteUser', err);
            throw err;
        }
    }
}

export default User;