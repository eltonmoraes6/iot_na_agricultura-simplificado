import { DeepPartial, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const sensorRepository = AppDataSource.getRepository(Sensor);

export const createSensor = async (input: DeepPartial<Sensor>) => {
  return sensorRepository.save(sensorRepository.create(input));
};

export const findSensorBySeason = async (season: string) => {
  return await sensorRepository.find({
    where: { season: season },
    relations: { soil: true },
  });
};

export const findSensorById = async (sensorId: string) => {
  return await sensorRepository.findOne({
    where: { id: sensorId },
    relations: { soil: true },
  });
};

export const findOneSensor = async () => {
  const options: FindManyOptions<Sensor> = {
    take: 1,
    order: { created_at: 1 },
    relations: { soil: true },
  };
  return await sensorRepository.find(options);
};

export const findSensor = async (query: FindManyOptions<Sensor>) => {
  // Modify the query object to include the limit of 10
  const modifiedQuery: FindManyOptions<Sensor> = {
    ...query,
    take: 10,
    relations: { soil: true },
  };
  // Call the find method of sensorRepository with the modified query
  return await sensorRepository.find(modifiedQuery);
};

export const getDailyAndPeriodAverages = async () => {
  const periodDataQuery = sensorRepository
    .createQueryBuilder('sensor')
    .select([
      'AVG(temperature) AS temperature',
      'AVG(humidity) AS humidity',
      "CASE WHEN EXTRACT(HOUR FROM sensor.created_at) BETWEEN 6 AND 11 THEN 'morning' WHEN EXTRACT(HOUR FROM sensor.created_at) BETWEEN 12 AND 17 THEN 'afternoon' ELSE 'night' END AS period",
    ])
    .groupBy('period');

  const wholeDayAveragesQuery = sensorRepository
    .createQueryBuilder('sensor')
    .select([
      'AVG(temperature) AS day_average_temperature',
      'AVG(humidity) AS day_average_humidity',
    ]);

  const [periodData, wholeDayAverages] = await Promise.all([
    periodDataQuery.getRawMany(),
    wholeDayAveragesQuery.getRawOne(),
  ]);

  return [
    {
      period: 'whole_day',
      average_temperature: wholeDayAverages.day_average_temperature,
      average_humidity: wholeDayAverages.day_average_humidity,
      sensor_data: null,
    },
    ...periodData.map((period) => ({
      period: period.period,
      average_temperature: period.temperature,
      average_humidity: period.humidity,
      sensor_data: null, // Replace null with your actual sensor data if needed
    })),
  ];
};

const validateFields = (fields: string[]): (keyof Sensor)[] => {
  const validFields: (keyof Sensor)[] = [
    'id',
    'temperature',
    'humidity',
    'season',
    'soil',
    'created_at',
    'updated_at',
  ];
  return fields.filter((field) =>
    validFields.includes(field as keyof Sensor)
  ) as (keyof Sensor)[];
};

export const findSensorsAdvanced = async (
  options: QueryOptions
): Promise<Sensor[]> => {
  const findOptions: FindManyOptions<Sensor> = {};

  // Ensure relations are included if requested in fields
  findOptions.relations = { soil: true };

  // Apply filters with the parsed conditions
  if (options.filters) {
    findOptions.where = options.filters;
  }

  // Apply sorting
  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = { [field]: order } as FindOptionsOrder<Sensor>;
  }

  // Apply pagination
  if (options.pagination) {
    const { page, limit } = options.pagination;
    findOptions.skip = (page - 1) * limit;
    findOptions.take = limit;
  }

  // Apply field selection
  if (options.fields) {
    const validFields = validateFields(options.fields); // Ensure these are valid
    findOptions.select = validFields;
  }

  return await sensorRepository.find(findOptions);
};
