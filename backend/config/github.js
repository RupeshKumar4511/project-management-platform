import {GitHub} from 'arctic';
import {config} from 'dotenv';
config();


const github = new GitHub(
    process.env.GITHUB_CLIENT_ID,
    process.env.GITHUB_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/github/callback`
    
)

export default github;