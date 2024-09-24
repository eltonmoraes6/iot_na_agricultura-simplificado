import express from 'express';
import {
  findSeasonByIdHandler,
  indexHandler,
  registerSeasonHandler,
} from '../controllers/season.controller';
import { validate } from '../middleware/validate';
import { createSeasonSchema } from '../schemas/season.schema';

const router = express.Router();

// Register Season Info
router.post('/create', validate(createSeasonSchema), registerSeasonHandler);
// Show Humidities Info
// http://localhost:5000/api/seasons/info/index/?limit=10
router.get('/info/index', indexHandler);
// Get Single Season Info
router.get('/:seasonId', findSeasonByIdHandler);

export default router;
