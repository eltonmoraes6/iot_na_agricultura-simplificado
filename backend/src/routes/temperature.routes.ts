import express from 'express';
import {
  findLatestHandler,
  findTemperatureByIdHandler,
  indexHandler,
  registerTemperatureHandler,
} from '../controllers/temperature.controller';
import { validate } from '../middleware/validate';
import { createTemperatureSchema } from '../schemas/temperature.schema';

const router = express.Router();

// Register Temperature Info
router.post(
  '/create',
  validate(createTemperatureSchema),
  registerTemperatureHandler
);
// Show Temperatures Info
//http://localhost:5000/api/temperatures/info/index/?limit=10
router.get('/info/index', indexHandler);

router.get('/info/latest', findLatestHandler);
// Get Single Temperature Info
router.get('/:temperatureId', findTemperatureByIdHandler);

export default router;
