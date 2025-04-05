import jwt from 'jsonwebtoken';
import User from '../../models/user.js';

class AccountController {
    constructor() {
        this.user = new User();
    }

    /**
     * Create a new user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async create(req, res) {
        const { username, email, password, birthdate } = req.body || {};

        try {
            const response = await this.user.create(username, email, password, birthdate);

            res.send({
                success: true,
                data: {
                    recordIndex: response?.insertId,
                },
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.message === 'username' || err.message === 'email' ? err.message : 'Failed to create account',
                
            });
        }
        
    }

    /**
     * Log in a user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async login(req, res) {
        try {
            const { username, password } = req.body || {};

            const result = await this.user.verify(username, password);

            if (!result?.user_id) {
                return res.send({
                    success: false,
                    message: 'Invalid username or password',
                });
            } else {
                res.send({
                    success: true,
                    data: {
                        token: jwt.sign({ username: username, user_id: result?.user_id }, process.env.API_SECRET_KEY, {
                            expiresIn: '1d',
                        }),
                    },
                });
            }
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }

    /**
     * Get user profile information.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async profile(req, res) {
        try {
            const userInfo = await this.user.getUser(res.locals.username);

            res.send({
                success: true,
                data: {
                    id: res.locals.user_id,
                    username: res.locals.username,
                    email: userInfo?.email,
                    birth_date: userInfo?.birth_date,
                    balance: userInfo?.user_balance,
                },
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }

    /**
     * Update user profile information.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateProfile(req, res) {
        try {
            const { username, currentPassword, newPassword, email } = req.body || {};

            const currentUsername = res.locals.username;

            const result = await this.user.updateUser(currentUsername, username, currentPassword, newPassword, email);

            if (result.affectedRows > 0) {
                const updatedUser = await this.user.getUser(username || currentUsername);

                if (!updatedUser) {
                    return res.send({
                        success: false,
                        message: 'User not found after update',
                    });
                }

                // Generate a new token if the username was changed
                const newToken = username && username !== currentUsername
                    ? jwt.sign({ username: username, user_id: res.locals.user_id }, process.env.API_SECRET_KEY, {
                        expiresIn: '1d',
                    })
                    : null;

                res.send({
                    success: true,
                    message: 'Profile Updated!',
                    data: {
                        token: newToken,
                    },
                });
            } else {
                res.send({
                    success: false,
                    message: 'Profile update failed!',
                });
            }
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }

    /**
     * Delete a user account.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteUser(req, res) {
        try {
            const { password } = req.body || {};

            const currentUsername = res.locals.username;

            const result = await this.user.deleteUser(currentUsername);

            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: 'Account Deleted Successfully!',
                });
            } else {
                res.send({
                    success: false,
                    message: 'Failed to delete the user',
                });
            }
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default AccountController;