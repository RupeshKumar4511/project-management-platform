import { generateState } from 'arctic';
import github from '../config/github.js';
import { config } from 'dotenv'
import { createUserWithOauth, getUserWithOauthId, linkUserWithOauth } from '../controllers/github.controller.js';
import { tokens } from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, options } from '../controllers/auth.controller.js';
config()

export const getGithubLoginPage = async (req, res) => {

    if (req.user) return res.redirect(`${process.env.FRONTEND_URL}`)

    const state = generateState();

    const url = github.createAuthorizationURL(state, ["user:email"]);

    const cookieConfig = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 1000 * 60 * 60
    }

    res.cookie('github_oauth_state', state, cookieConfig);

    return res.redirect(url.toString())
}

export const getGithubCallbackPage = async (req, res) => {

    const { code, state } = req.query;
    const { github_oauth_state: storedState } = req.cookies;

    function handleFailedLogin() {
        console.log("error: Couldn't login with github because of invalid attempts, Please try again")

        res.redirect(`${process.env.FRONTEND_URL}`)
    }


    if (!code || !state || state !== storedState) {
        return handleFailedLogin()
    }


    let token;

    try {
        token = github.validateAuthorizationCode(code);

        if (!token || !token.accessToken()) {
            return handleFailedLogin()
        }

    } catch (error) {
        console.log(error);
        return handleFailedLogin()
    }

    // till now github verification is successfull

    // get the userId and name 

    const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${token.accessToken()}`
        }
    })

    if (!githubUserResponse.ok) return handleFailedLogin()

    const githubUser = await githubUserResponse.json()

    const { id: githubUserId, name } = githubUser;


    // get email
    const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
            Authorization: `Bearer ${token.accessToken()}`
        }
    })

    if (!githubEmailResponse.ok) return handleFailedLogin()

    const emails = await githubEmailResponse.json();
    const email = emails.filter(e => e.primary)[0].email;

    if (!email) return handleFailedLogin();

    try {
        
    // Case 1 : User already exists with github oauth link 
    let user = await getUserWithOauthId({
        provider: 'github',
        email
    })

    // Case 2 : User exist but does not with github oauth link

    if (user && !user.providerAccountId) {
        await linkUserWithOauth({
            userId: user.id,
            provider: "github",
            providerAccountId: githubUserId
        })
    }

    // Case 3 : User does not exist
    if (!user) {
        user = await createUserWithOauth({
            name,
            email,
            provider: 'github',
            providerAccountId: githubUserId
        })
    }

    res.clearCookie('github_oauth_state')


    // check for old token 
    const [dbToken] = await db.select().from(tokens).where(eq(tokens.userId, user.id))

    if (dbToken) {
        await db.delete(tokens).where(eq(tokens.userId, user.id))
    }


    // create AccessToken and RefreshToken ;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await db.insert(tokens).values({ userId: user.id, refreshToken: refreshToken, expiredAt: expiresAt })


    res.cookie("accessToken", accessToken, options)
    res.cookie("refreshToken", refreshToken, options)

    redirect(`${process.env.FRONTEND_URL}/app`)
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:'false',message:'Internal Server Error'})
    }
}