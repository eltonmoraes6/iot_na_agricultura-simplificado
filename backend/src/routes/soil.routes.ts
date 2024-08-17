import express from 'express';
import { getPestsAndDiseasesHandler } from '../controllers/pestsPrediction.controller';
import {
  calculatePotentialEvapotranspiration,
  calculateSoilHumidityLimits,
  calculateWaterDeficiency,
  getIdealHumidity,
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
router.get('/info/index', indexHandler);

router.post('/calculate-water-deficiency', calculateWaterDeficiency);
router.post(
  '/calculate-potential-evapotranspiration',
  calculatePotentialEvapotranspiration
);
router.post('/get-ideal-temperature', getIdealTemperature);

router.post('/get-ideal-humidity', getIdealHumidity);
// Dados Completos
// [
// 	{
// 		"soilType": "Argissolos",
// 		"minHumidity": "98.00",
// 		"maxHumidity": "100.00",
// 		"minTemperature": "24.96",
// 		"maxTemperature": "24.96",
// 		"sensorData": [
// 			{
// 				"temperature": "23.07",
// 				"humidity": "100.00",
// 				"season": "Winter"
// 			},
//     }
//   ]
router.get('/soil-humidity-limits', getSoilHumidityLimits);
// {
// 	"predictedMinTemperature": 24.959999999409774,
// 	"predictedMaxTemperature": 24.959999999322463
// }
router.get('/predict-ideal-temperatures', predictIdealTemperatures);

// Simplificado
// {
// 	"minHumidity": 98,
// 	"maxHumidity": 100,
// 	"predictedTemperature": 24.955489129150408
// }
router.get('/calculate-soil-humidity-limits', calculateSoilHumidityLimits);
router.get('/predict-pests-and-diseases', getPestsAndDiseasesHandler);

export default router;
