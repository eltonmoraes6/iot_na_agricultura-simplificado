import axios from 'axios';
import config from '../../config/custom-environment-variables';

require('dotenv').config();

import { Weather } from '../entities/weather.entity';
import { AppDataSource } from '../utils/data-source';

const openWeatherMapConfig = config.openWeatherMap;

const weatherRepository = AppDataSource.getRepository(Weather);

class WeatherService {
  async getWeather(lat: string, lon: string) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const now = new Date();
    const halfHour = Math.floor(now.getMinutes() / 30) * 30;
    now.setMinutes(halfHour, 0, 0);

    const weatherData = await weatherRepository.findOne({
      where: { lat: latNum, lon: lonNum, timestamp: now },
    });

    if (weatherData) {
      return weatherData;
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: latNum,
          lon: lonNum,
          appid: openWeatherMapConfig.apiKey,
          units: 'metric',
        },
      }
    );

    const weather = response.data;
    console.log('weather ========> ', weather);
    const newWeather = weatherRepository.create({
      lat: latNum,
      lon: lonNum,
      temp: weather.main.temp,
      description: weather.weather[0].description,
      timestamp: now,
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      wind_speed: weather.wind.speed,
      name: weather.name,
      feels_like: weather.main.feels_like,
    });

    await weatherRepository.save(newWeather);
    return newWeather;
  }
}

export default new WeatherService();
