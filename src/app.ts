import express from 'express';
import cors from 'cors';
import commentRoutes from './routes/comment.routes';
import userRoutes from "./routes/user.routes";
import dotenv from 'dotenv';
import {connectDB} from "./db";

dotenv.config();

const app = express();

connectDB()


// Middlewares
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Core is running');
});

app.use('/api/comment', commentRoutes);
app.use('/api/user', userRoutes);


export default app;
