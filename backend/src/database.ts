import { createConnection } from 'typeorm';
import { AppLogger, LogTypes } from './logger';

export const connectDB = async (): Promise<void> => {
  await createConnection().then(() => {
    AppLogger.info(LogTypes.TYPEORM_CONNECTION, 'TypeORM Mongoose Connected');
  }).catch(error => console.log(error));
};