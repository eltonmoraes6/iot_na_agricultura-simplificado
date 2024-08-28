import { Router } from 'express';
import {
  handleConfigFormSubmission,
  renderConfigPage,
  startServer,
  stopServer,
} from '../controllers/config.controller';

const router = Router();

router.get('/', renderConfigPage);
router.post('/', handleConfigFormSubmission);
router.post('/server/start', startServer);
router.post('/server/stop', stopServer);

export default router;
