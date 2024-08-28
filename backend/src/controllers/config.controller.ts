import { Request, Response } from 'express';
import { loadConfig, saveConfig } from '../services/configuration.service';

export function renderConfigPage(req: Request, res: Response): void {
  const config = loadConfig();
  res.render('configuration', { config });
}

export function handleConfigFormSubmission(req: Request, res: Response): void {
  const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    KAFKA_BROKERS,
    OPEN_WEATHER_MAP_API_KEY,
  } = req.body;

  const config = {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    KAFKA_BROKERS,
    OPEN_WEATHER_MAP_API_KEY,
  };

  saveConfig(config);
  res.redirect('/');
}

export function startServer(req: Request, res: Response): void {
  // Implement logic to start the server
  res.send('Server started');
}

export function stopServer(req: Request, res: Response): void {
  // Implement logic to stop the server
  res.send('Server stopped');
}
