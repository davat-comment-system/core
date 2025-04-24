import express from 'express';
import cors from 'cors';
import commentRoutes from './routes/comment.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Core is running');
});
app.use('/comments', commentRoutes);


export default app;
