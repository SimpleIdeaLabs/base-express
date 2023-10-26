import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './error';
import { apiLogger } from './logger';
import sampleRouter from './modules/sample/sample-router';

const app = express();

/**
 * middlewares
 */
app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(apiLogger);

/**
 * routes
 */
app.use('/sample', sampleRouter);

/**
 * handlers
 */
app.use(errorHandler);

export default app;
