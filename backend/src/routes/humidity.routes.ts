import express from 'express';
import {
  findHumidityByIdHandler,
  findLatestHandler,
  indexHandler,
  registerHumidityHandler,
} from '../controllers/humidity.controller';
import { validate } from '../middleware/validate';
import { createHumiditySchema } from '../schemas/humidity.schema';

const router = express.Router();

// Register Humidity Info
router.post('/create', validate(createHumiditySchema), registerHumidityHandler);
// Show Humidities Info
// http://localhost:5000/api/humidities/info/index/?limit=10
router.get('/info/index', indexHandler);

router.get('/info/latest', findLatestHandler);
// Get Single Humidity Info
router.get('/:humidityId', findHumidityByIdHandler);

export default router;
