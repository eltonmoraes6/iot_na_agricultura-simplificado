import { DeepPartial, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { Humidity } from '../entities/humidity.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const humidityRepository = AppDataSource.getRepository(Humidity);

export const createHumidity = async (input: DeepPartial<Humidity>) => {
  return humidityRepository.save(humidityRepository.create(input));
};

export const findHumidityById = async (temperatureId: string) => {
  return await humidityRepository.findOne({
    where: { id: temperatureId },
    relations: {},
  });
};

export const findOne = async () => {
  const options: FindManyOptions<Humidity> = {
    take: 1,
    order: { created_at: 1 },
    relations: {},
  };
  return await humidityRepository.find(options);
};

const validateFields = (fields: string[]): (keyof Humidity)[] => {
  const validFields: (keyof Humidity)[] = [
    'id',
    'humidity',
    'created_at',
    'updated_at',
  ];
  return fields.filter((field) =>
    validFields.includes(field as keyof Humidity)
  ) as (keyof Humidity)[];
};

export const findHumiditysAdvanced = async (
  options: QueryOptions
): Promise<Humidity[]> => {
  const findOptions: FindManyOptions<Humidity> = {};

  // Ensure relations are included if requested in fields
  findOptions.relations = {};

  // Apply filters with the parsed conditions
  if (options.filters) {
    findOptions.where = options.filters;
  }

  // Apply sorting
  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = { [field]: order } as FindOptionsOrder<Humidity>;
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

  return await humidityRepository.find(findOptions);
};
