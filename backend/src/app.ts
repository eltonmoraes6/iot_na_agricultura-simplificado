import 'reflect-metadata';
require('dotenv').config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';

import config from '../config/custom-environment-variables';
import configRoutes from './routes/config.routes';
import sensorsRouter from './routes/sensor.routes';
import soilsRouter from './routes/soil.routes';
import weatherRouter from './routes/weather.routes';

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

    // TEMPLATE ENGINE
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
        origin: config.cors.origin,
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
    app.use('/api/sensors', sensorsRouter);
    app.use('/api/soils', soilsRouter);
    app.use('/api/weather', weatherRouter);

    // Handle 404 errors
    app.all('/404', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // Serve index.html for all other routes
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    // Global error handler
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
  } catch (error) {
    console.error('Error during app initialization:', error);
    process.exit(1);
  }
}

// Start the application
initializeApp();

export default app;
