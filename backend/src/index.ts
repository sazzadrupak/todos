import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './database'
import 'dotenv/config';
import { AppRouter } from './AppRouter';
import './controllers/SignUpController';
import { errorMiddleware } from './middleware';
import { AppLogger, LogTypes } from './logger';

const PORT: number = parseInt(<string>process.env.PORT);

const app = express();
app.use(bodyParser.json());
app.use(AppRouter.getInstance());
app.use(cors());
app.use(errorMiddleware);
AppLogger.configureLogger();

const startServer = async () => {
  app.listen(PORT, () => {
    AppLogger.info(LogTypes.SERVER_START, `Server running on http://localhost:${PORT}`);
  });
};

(async () => {
  await connectDB();
  await startServer();
})();