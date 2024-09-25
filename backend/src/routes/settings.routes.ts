import express from 'express';
import {
  getConfigHandler,
  getLogHandler,
} from '../controllers/settings.controller';

const router = express.Router();

// Route to get configuration data
router.get('/config', getConfigHandler);

// Route to get log data (either 'error' or 'combined')
router.get('/logs/:logType', getLogHandler);

export default router;
