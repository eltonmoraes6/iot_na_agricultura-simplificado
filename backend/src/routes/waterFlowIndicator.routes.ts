import { Router } from 'express';
import {
  createWaterFlowIndicatorController,
  findLatestHandler,
  getAllWaterFlowIndicatorsController,
  getWaterFlowIndicatorController,
  indexHandler,
  updateWaterFlowIndicatorController,
} from '../controllers/waterFlowIndicator.controller';

const router = Router();

router.post('/water-flow-indicators', createWaterFlowIndicatorController);
router.get('/water-flow-indicators/:id', getWaterFlowIndicatorController);
router.put('/water-flow-indicators/:id', updateWaterFlowIndicatorController);
router.get('/water-flow-indicators', getAllWaterFlowIndicatorsController);
//http://localhost:5000/api/temperatures/info/index/?limit=10
router.get('/info/index', indexHandler);

router.get('/info/latest', findLatestHandler);

export default router;
