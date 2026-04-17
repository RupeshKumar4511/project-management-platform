import {GitHub} from 'arctic';
import {config} from 'dotenv';
config();


const github = new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/api/v1/auth/github/callback`
    
)

export default github;