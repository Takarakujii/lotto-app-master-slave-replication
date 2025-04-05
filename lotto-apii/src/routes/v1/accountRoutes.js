import { Router } from 'express';
import AccountController from '../../controllers/v1/accountController.js';
import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

const accountRouter = new Router();
const account = new AccountController();

// Apply authorization middleware
accountRouter.use(authorization);

// Login
accountRouter.post('/login', account.login.bind(account));

// Create Account
accountRouter.post('/', account.create.bind(account));

// Get Profile
accountRouter.get('/', authentication, account.profile.bind(account));

// Update Profile
accountRouter.patch('/', authentication, account.updateProfile.bind(account));

// Delete Account
accountRouter.delete('/', authentication, account.deleteUser.bind(account));

export default accountRouter;