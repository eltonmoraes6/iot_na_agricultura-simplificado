import { Router } from 'express';
import {
  calculatePotentialEvapotranspiration,
  calculateWaterDeficiency,
  getAveragesHandler,
  indexHandler,
  registerMetricHandler,
} from '../controllers/metric.controller';

const router = Router();

// Route to get all metrics with filters, sorting, and pagination
// http://localhost:5000/api/metrics/info/index/?limit=10
router.get('/info/index', indexHandler);

router.get('/info/averages', getAveragesHandler);

// Route to create a new metric
router.post('/', registerMetricHandler);

// Route to calculate water deficiency
router.post('/calculate-water-deficiency', calculateWaterDeficiency);

// Route to calculate potential evapotranspiration
router.post(
  '/calculate-potential-evapotranspiration',
  calculatePotentialEvapotranspiration
);

export default router;
