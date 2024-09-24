import express from 'express';
import {
  findSoilByIdHandler,
  indexHandler,
  registerSoilHandler,
} from '../controllers/soil.controller';
import { validate } from '../middleware/validate';
import { createSoilSchema } from '../schemas/soil.schema';

const router = express.Router();

// Register Soil Info
router.post('/create', validate(createSoilSchema), registerSoilHandler);
// Show Soils Info
// http://localhost:5000/api/soils/info/index/?limit=10
router.get('/info/index', indexHandler);
// Get Single Soil Info
router.get('/:soilId', findSoilByIdHandler);

export default router;
