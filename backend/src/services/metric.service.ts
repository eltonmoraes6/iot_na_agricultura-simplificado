import { DeepPartial, FindManyOptions } from 'typeorm';

import { Humidity } from '../entities/humidity.entity';
import { Metric } from '../entities/metric.entity';
import { Soil } from '../entities/soil.entity';
import { Temperature } from '../entities/temperature.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const humidityRepository = AppDataSource.getRepository(Humidity);
const temperatureRepository = AppDataSource.getRepository(Temperature);
const metricRepository = AppDataSource.getRepository(Metric);

// Deficiência de Água (DA) => Quantidade de água disponível para as plantas => DA = CC - Umidade Atual do solo
export const waterDeficiency = async (
  currentHumidity: number,
  fieldCapacity: number
) => {
  const waterDeficiency = fieldCapacity - currentHumidity;
  return waterDeficiency;
};

export const potentialEvapotranspiration = async (kc: number, eto: number) => {
  const potentialEvapotranspiration = kc * eto;
  return potentialEvapotranspiration;
};

// Ponto de Murcha Permanente => PMP => Limite mínimo de umidade do solo para as plantas
export const permanentWiltingPoint = async (soilType: string) => {
  const result = await metricRepository.findOneBy({ soilType: soilType });
  if (result) {
    return result.minHumidity;
  }
  throw new Error('Soil type not found');
};

// Capacidade de Campo => CC => Limite máximo de umidade do solo para as plantas
export const fieldCapacity = async (soilType: string) => {
  const result = await metricRepository.findOneBy({ soilType: soilType });
  if (result) {
    return result.maxHumidity;
  }
  throw new Error('Soil type not found');
};

export const createMetric = async (input: DeepPartial<Metric>) => {
  return metricRepository.save(metricRepository.create(input));
};

export const findMetricById = async (soilId: string) => {
  return await metricRepository.findOne({
    where: { id: soilId },
  });
};

const validKeys = [
  'id',
  'minHumidity',
  'maxHumidity',
  'minTemperature',
  'maxTemperature',
  'soilType' as keyof Soil, // Type assertion
  'season',
  'created_at',
  'updated_at',
] as const;

type ValidKeys = (typeof validKeys)[number];

const validateFields = (fields: string[]): ValidKeys[] => {
  return fields.filter((field): field is ValidKeys =>
    validKeys.includes(field as ValidKeys)
  );
};

export const findMetricsAdvanced = async (
  options: QueryOptions
): Promise<Metric[]> => {
  const findOptions: FindManyOptions<Metric> = {};

  // Apply filters, sorting, pagination, and field selection
  if (options.filters) {
    findOptions.where = options.filters;
  }

  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = { [field]: order };
  } else {
    findOptions.order = { created_at: 'DESC' };
  }

  if (options.pagination) {
    const { page, limit } = options.pagination;
    findOptions.skip = (page - 1) * limit;
    findOptions.take = limit;
  }

  if (options.fields) {
    const validFields = validateFields(options.fields);
    findOptions.select = validFields;
  }

  return await metricRepository.find(findOptions);
};

export const calculateAverages = async () => {
  // Query to get period-wise averages for temperature
  const periodTemperatureDataQuery = temperatureRepository
    .createQueryBuilder('temperature')
    .select([
      'AVG(temperature.temperature) AS temperature',
      "CASE WHEN EXTRACT(HOUR FROM temperature.created_at) BETWEEN 6 AND 11 THEN 'morning' WHEN EXTRACT(HOUR FROM temperature.created_at) BETWEEN 12 AND 17 THEN 'afternoon' ELSE 'night' END AS period",
    ])
    .groupBy('period');

  // Query to get period-wise averages for humidity
  const periodHumidityDataQuery = humidityRepository
    .createQueryBuilder('humidity')
    .select([
      'AVG(humidity.humidity) AS humidity',
      "CASE WHEN EXTRACT(HOUR FROM humidity.created_at) BETWEEN 6 AND 11 THEN 'morning' WHEN EXTRACT(HOUR FROM humidity.created_at) BETWEEN 12 AND 17 THEN 'afternoon' ELSE 'night' END AS period",
    ])
    .groupBy('period');

  // Query to get whole-day averages for temperature
  const wholeDayTemperatureAveragesQuery = temperatureRepository
    .createQueryBuilder('temperature')
    .select(['AVG(temperature.temperature) AS day_average_temperature']);

  // Query to get whole-day averages for humidity
  const wholeDayHumidityAveragesQuery = humidityRepository
    .createQueryBuilder('humidity')
    .select(['AVG(humidity.humidity) AS day_average_humidity']);

  // Run all queries concurrently
  const [
    periodTemperatureData,
    periodHumidityData,
    wholeDayTemperatureAverages,
    wholeDayHumidityAverages,
  ] = await Promise.all([
    periodTemperatureDataQuery.getRawMany(),
    periodHumidityDataQuery.getRawMany(),
    wholeDayTemperatureAveragesQuery.getRawOne(),
    wholeDayHumidityAveragesQuery.getRawOne(),
  ]);

  // Merge the period data for temperature and humidity
  const periodData = periodTemperatureData.map(
    (tempPeriod: { period: any; temperature: any }) => {
      const correspondingHumidity = periodHumidityData.find(
        (humidPeriod: { period: any }) =>
          humidPeriod.period === tempPeriod.period
      );
      return {
        period: tempPeriod.period,
        average_temperature: tempPeriod.temperature,
        average_humidity: correspondingHumidity
          ? correspondingHumidity.humidity
          : null,
      };
    }
  );

  // Return combined whole day and period data
  return [
    {
      period: 'whole_day',
      average_temperature: wholeDayTemperatureAverages.day_average_temperature,
      average_humidity: wholeDayHumidityAverages.day_average_humidity,
    },
    ...periodData,
  ];
};
