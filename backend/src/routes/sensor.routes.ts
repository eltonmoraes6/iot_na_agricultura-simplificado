import express from 'express';
import {
  findSeasonByHandler,
  getDailyAndPeriodAveragesHandler,
  getLastSensor,
  indexHandler,
  registerSensorHandler,
} from '../controllers/sensor.controller';
import { validate } from '../middleware/validate';
import { createSensorSchema } from '../schemas/sensor.schema';

const router = express.Router();

// Register Sensor Info
router.post('/create', validate(createSensorSchema), registerSensorHandler);

// Show Sensor Info - http://localhost:5000/api/sensors/info/advanced?limit=10&page=1fields=huidity&sortOrder=DESC&sort=humidity
router.get('/info/index', indexHandler);

// season
router.get('/:season', findSeasonByHandler);

// // season
router.get('/info/one', getLastSensor);

// Add a new route for calculating averages
router.get('/info/daily-and-period-averages', getDailyAndPeriodAveragesHandler);

export default router;
