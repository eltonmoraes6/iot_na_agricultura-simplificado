import 'reflect-metadata';
import winston from 'winston';

require('dotenv').config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

import configRoutes from './routes/config.routes';
import humidityRouter from './routes/humidity.routes';
import metricsRouter from './routes/metric.routes';
import pestsPrediction from './routes/pests.Prediction.routes';
import seasonRouter from './routes/season.routes';
import soilsRouter from './routes/soil.routes';
import temperatureRouter from './routes/temperature.routes';

import weatherRouter from './routes/weather.routes';

import './services/consumer.service';
import './services/producer.service';

import AppError from './utils/appError';
import { initializeMainDataSource } from './utils/data-source';
import validateEnv from './utils/validateEnv';

// Initialize the app
const app = express();

// Function to check if configuration is complete
function checkIfConfigIsComplete(): boolean {
  try {
    const configPath = path.join(__dirname, './config/config.json');
    if (!fs.existsSync(configPath)) {
      return false;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Explicitly check if the host is a non-empty string
    const isHostValid =
      typeof config.POSTGRES_HOST === 'string' &&
      config.POSTGRES_HOST.trim() !== '';

    // Check if port is a valid number greater than 0
    const isPortValid =
      typeof config.POSTGRES_PORT === 'string' &&
      parseInt(config.POSTGRES_PORT) > 0;

    return isHostValid && isPortValid;
  } catch (error) {
    return false;
  }
}

// Initialize application
async function initializeApp() {
  try {
    console.log('Initializing App...');

    // Winston Logger Configuration
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: 'ViaRoteiros' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }

    // TEMPLATE ENGINE
    app.use('/', express.static(path.join(__dirname, '../views')));

    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));

    // Validate environment variables
    validateEnv();

    // MIDDLEWARE
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true }));
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

    app.use(cookieParser());
    app.use(
      cors({
        origin: true,
        credentials: true,
      })
    );

    // Serve configuration routes
    app.use('/config', configRoutes);

    // Check if configuration is complete
    const isConfigComplete = checkIfConfigIsComplete();

    console.log('isConfigComplete =======> ', isConfigComplete);

    if (!isConfigComplete) {
      console.log(
        'Configuration is incomplete. Redirecting to configuration page...'
      );
      // Serve the Handlebars template for configuration
      app.get('/config', (req: Request, res: Response) => {
        res.render('configuration');
      });
      return; // Stop further initialization
    }

    // Initialize main data source
    console.log('Initializing Main Data Source...');
    await initializeMainDataSource();
    console.log('Main Data Source initialized');

    // Serve static files
    app.use('/', express.static(path.join(__dirname, '../build')));
    app.use('/', express.static(path.join(__dirname, '../dist')));

    // ROUTES
    app.use('/api/metrics', metricsRouter);
    app.use('/api/soils', soilsRouter);
    app.use('/api/weather', weatherRouter);
    app.use('/api/temperatures', temperatureRouter);
    app.use('/api/humidities', humidityRouter);
    app.use('/api/seasons', seasonRouter);
    app.use('/api/pests-prediction', pestsPrediction);

    // Handle 404 errors
    app.all('/404', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // Serve index.html for all other routes
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        logger.error(
          `StatusCode: ${error.statusCode || 500}, Message: ${
            error.message
          }, Stack: ${error.stack}`
        );

        error.status = error.status || 'error';
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );
  } catch (error) {
    console.error('Error during app initialization:', error);
    process.exit(1);
  }
}

// Start the application
initializeApp();

export default app;
