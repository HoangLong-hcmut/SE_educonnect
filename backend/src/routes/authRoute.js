import express from 'express'
// import { signIn, signOut, signUp, ssoLoginCallback, refresh } from '../controllers/authController.js'
import { signOut, ssoLoginCallback, refresh } from '../controllers/authController.js'

const router = express.Router();

// router.post('/signup', signUp);

// router.post('/signin', signIn);

router.post('/signout', signOut);

router.get('/sso-callback', ssoLoginCallback);

router.post('/refresh', refresh);

export default router