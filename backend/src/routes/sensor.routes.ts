import express from 'express';
import {
  findSeasonByHandler,
  getDailyAndPeriodAveragesHandler,
  indexHandler,
  registerSensorHandler,
} from '../controllers/sensor.controller';
import { validate } from '../middleware/validate';
import { createSensorSchema } from '../schemas/sensor.schema';

const router = express.Router();

// Register Sensor Info
router.post('/create', validate(createSensorSchema), registerSensorHandler);

// Show Sensor Info
router.get('/index', indexHandler);

// // Logout user
router.get('/:season', findSeasonByHandler);

// Add a new route for calculating averages
router.get('/info/daily-and-period-averages', getDailyAndPeriodAveragesHandler);

export default router;
