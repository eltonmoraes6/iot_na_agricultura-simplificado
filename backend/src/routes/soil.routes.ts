import express from 'express';
import { getPestsAndDiseasesHandler } from '../controllers/pestsPrediction.controller';
import {
  calculatePotentialEvapotranspiration,
  calculateSoilHumidityLimits,
  calculateWaterDeficiency,
  getAllSoilsHandler,
  getIdealTemperature,
  getSoilHumidityLimits,
  indexHandler,
  predictIdealTemperatures,
  registerSoilHandler,
} from '../controllers/soil.controller';
import { validate } from '../middleware/validate';
import { createSoilSchema } from '../schemas/soil.schema';

const router = express.Router();

// Register Soil Info
router.post('/create', validate(createSoilSchema), registerSoilHandler);
// Show Soil Info
router.get('/index', indexHandler);
router.get('/info/advanced', getAllSoilsHandler);

router.post('/calculate-water-deficiency', calculateWaterDeficiency);
router.post(
  '/calculate-potential-evapotranspiration',
  calculatePotentialEvapotranspiration
);
router.post('/get-ideal-temperature', getIdealTemperature);

router.get('/soil-humidity-limits', getSoilHumidityLimits);
router.get('/predict-ideal-temperatures', predictIdealTemperatures);

router.get('/calculate-soil-humidity-limits', calculateSoilHumidityLimits);

router.get('/predict-pests-and-diseases', getPestsAndDiseasesHandler);

export default router;
