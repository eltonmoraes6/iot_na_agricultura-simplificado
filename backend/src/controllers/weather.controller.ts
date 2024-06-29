import { Request, Response } from 'express';
import weatherService from '../services/weather.service';

class WeatherController {
  async getWeather(req: Request, res: Response) {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: 'Latitude and longitude are required' });
    }

    try {
      const weather = await weatherService.getWeather(
        lat as string,
        lon as string
      );
      return res.json(weather);
    } catch (error) {
      console.log('Error =======> ', error);
      return res.status(500).json({ error: 'Error fetching weather data' });
    }
  }
}

export default new WeatherController();
