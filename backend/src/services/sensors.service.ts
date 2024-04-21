import { DeepPartial } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { AppDataSource } from '../utils/data-source';

const sensorRepository = AppDataSource.getRepository(Sensor);

export const createSensor = async (input: DeepPartial<Sensor>) => {
  return sensorRepository.save(sensorRepository.create(input));
};

export const findSensorBySeason = async (season: string) => {
  return await sensorRepository.findBy({ season: season });
};

export const findSensorById = async (sensorId: string) => {
  return await sensorRepository.findOneBy({ id: sensorId });
};

export const findSensor = async (query: Object) => {
  return await sensorRepository.find(query);
};

export const getDailyAndPeriodAverages = async () => {
  return await sensorRepository.query(`
  -- Step 1: Define periods based on created_at and group data by period
  WITH period_data AS (
    SELECT
      temperature,
      humidity,
      created_at,
      CASE
        WHEN EXTRACT(HOUR FROM created_at) BETWEEN 6 AND 11 THEN 'morning'
        WHEN EXTRACT(HOUR FROM created_at) BETWEEN 12 AND 17 THEN 'afternoon'
        ELSE 'night'
      END AS period
    FROM sensors
  ),
  
  -- Step 2: Calculate the whole-day averages for temperature and humidity
  whole_day_averages AS (
    SELECT
      AVG(temperature) AS day_average_temperature,
      AVG(humidity) AS day_average_humidity
    FROM period_data
  ),
  
  -- Step 3: Calculate the average temperature and humidity for each period
  period_averages AS (
    SELECT
      period,
      AVG(temperature) AS average_temperature,
      AVG(humidity) AS average_humidity
    FROM period_data
    GROUP BY period
  )
  
  -- Step 4: Return the whole-day averages and period averages
  SELECT
    'whole_day' AS period,
    whole_day_averages.day_average_temperature AS average_temperature,
    whole_day_averages.day_average_humidity AS average_humidity,
    NULL AS sensor_data
  FROM whole_day_averages
  
  UNION ALL
  
  SELECT
    period_averages.period AS period,
    period_averages.average_temperature AS average_temperature,
    period_averages.average_humidity AS average_humidity,
    json_agg(row_to_json(pd)) AS sensor_data
  FROM period_averages
  JOIN period_data pd ON period_averages.period = pd.period
  GROUP BY period_averages.period, period_averages.average_temperature, period_averages.average_humidity
  -- ORDER BY period_averages.period
`);
};
