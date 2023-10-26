import dotenv from 'dotenv';
import { get } from 'lodash';

dotenv.config();

interface CONFIG {
  ENV: string;
  PORT: number;
  MONGO_DB_URL: string;
}

export const config: CONFIG = {
  ENV: get(process, 'env.ENV', 'DEV'),
  PORT: Number(get(process, 'env.PORT', '3000')),
  MONGO_DB_URL: get(process, 'env.MONGO_DB_URL', '')
};
