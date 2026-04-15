import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import workspaceRoutes from './routes/workspace.routes.js'
import chatRoutes from './routes/chat.routes.js'
import { ensureAuth } from './middleware/ensureAuth.js';

const app = express();

app.use(cors({
    origin:'https://projectly-kj9b.onrender.com',
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',async(req,res)=>{
  return res.status(200).send({title:"Projectly-Backend",Health:"Ok"})
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/users/',ensureAuth,userRoutes)
app.use('/api/v1/workspace',ensureAuth,workspaceRoutes);
app.use('/api/v1/chat',ensureAuth,chatRoutes)


export default app;