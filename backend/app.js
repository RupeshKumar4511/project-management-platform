import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import workspaceRoutes from './routes/workspace.routes.js'
import { ensureAuth } from './middleware/ensureAuth.js';

const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))


app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/workspace',ensureAuth,workspaceRoutes);


export default app;