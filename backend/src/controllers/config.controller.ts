import { Request, Response, Router } from 'express';
import { ConfigService } from '../services/configuration.service';

// Create an instance of ConfigService
const configService = new ConfigService();

// Initialize the router
const router = Router();

// Get a specific configuration value by key
router.get('/config/:key', async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const value = await configService.get(key);
    if (value === null) {
      return res.status(404).json({ message: 'Configuration not found' });
    }
    res.status(200).json({ key, value });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Set a configuration value by key
router.post('/config', async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key || typeof value !== 'string') {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    await configService.set(key, value);
    res.status(200).json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error setting configuration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all configurations
router.get('/config', async (req: Request, res: Response) => {
  try {
    const configs = await configService.getAll();
    res.status(200).json(configs);
  } catch (error) {
    console.error('Error fetching all configurations:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
