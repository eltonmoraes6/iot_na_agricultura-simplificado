import express from 'express';
import { getPestsAndDiseasesHandler } from '../controllers/pestsPrediction.controller';

const router = express.Router();

router.get('/predict-pests-and-diseases', getPestsAndDiseasesHandler);

export default router;
