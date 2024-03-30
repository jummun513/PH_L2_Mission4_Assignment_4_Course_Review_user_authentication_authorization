import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

// parsers
app.use(express.json());

// application routes
app.use('/api', router);

// base routes
app.get('/', (req: Request, res: Response) => {
  res.send('Your Backend Server is Running');
});

// not found
app.use(notFound);

// global error handler routes
app.use(globalErrorHandler);

export default app;
