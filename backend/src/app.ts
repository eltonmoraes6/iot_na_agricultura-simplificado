require('dotenv').config();
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import sensorsRouter from './routes/sensor.routes';
import AppError from './utils/appError';
import { AppDataSource } from './utils/data-source';

import path from 'path';
import validateEnv from './utils/validateEnv';

// import './services/arduino.service';

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // TEMPLATE ENGINE

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: '10kb' }));

    // 2. Logger
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. Cors
    app.use(
      cors({
        origin: config.get<string>('origin'),
        credentials: true,
      })
    );
    // Serve static files from the build directory
    app.use(express.static(path.join(__dirname, '../build')));

    // ROUTES
    app.use('/api/sensors', sensorsRouter);

    // UNHANDLED ROUTE
    app.all('/404', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // Handle all other requests by sending the index.html file
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../build/index.html'));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    const port = config.get<number>('port');
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
