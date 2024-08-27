import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Path to the configuration JSON file
const configFilePath = path.join(__dirname, '../config/config.json');

// Load configuration from file
function loadConfig(): any {
  if (fs.existsSync(configFilePath)) {
    return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  }
  return {};
}

// Save configuration to file
function saveConfig(config: any): void {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

// Render configuration page
router.get('/', (req: Request, res: Response) => {
  const config = loadConfig();
  res.render('configuration', { config });
});

// Handle configuration form submission
router.post('/', (req: Request, res: Response) => {
  console.log('Received POST request to /config');
  const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    KAFKA_BROKER_1,
    KAFKA_BROKER_2,
  } = req.body;

  const config = {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    KAFKA_BROKER_1,
    KAFKA_BROKER_2,
  };

  saveConfig(config);
  res.redirect('/');
});

// Start server route
router.post('/server/start', (req: Request, res: Response) => {
  // Implement logic to start the server
  res.send('Server started');
});

// Stop server route
router.post('/server/stop', (req: Request, res: Response) => {
  // Implement logic to stop the server
  res.send('Server stopped');
});

export default router;
