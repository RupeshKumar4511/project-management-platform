import express from 'express';import { getGithubCallbackPage, getGithubLoginPage } from '../services/github.oauth.js';
;

const router = express.Router();

router.route('/').get(getGithubLoginPage)
router.route('/callback').get(getGithubCallbackPage)


export default router;