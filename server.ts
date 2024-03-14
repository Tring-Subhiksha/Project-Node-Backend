import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './Routes/route';
dotenv.config();
const app = express();
const port = 5000; 
console.log("port",process.env.PORT)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
    console.log(10,"Success");
    
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(express.json());
app.use('/api',routes)