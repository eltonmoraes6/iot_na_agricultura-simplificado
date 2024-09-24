import { DeepPartial, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { Temperature } from '../entities/temperature.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const temperatureRepository = AppDataSource.getRepository(Temperature);

export const createTemperature = async (input: DeepPartial<Temperature>) => {
  return temperatureRepository.save(temperatureRepository.create(input));
};

export const findTemperatureById = async (temperatureId: string) => {
  return await temperatureRepository.findOne({
    where: { id: temperatureId },
    relations: {},
  });
};

export const findOne = async () => {
  const options: FindManyOptions<Temperature> = {
    take: 1,
    order: { created_at: 1 },
    relations: {},
  };
  return await temperatureRepository.find(options);
};

const validateFields = (fields: string[]): (keyof Temperature)[] => {
  const validFields: (keyof Temperature)[] = [
    'id',
    'temperature',
    'created_at',
    'updated_at',
  ];
  return fields.filter((field) =>
    validFields.includes(field as keyof Temperature)
  ) as (keyof Temperature)[];
};

export const findTemperaturesAdvanced = async (
  options: QueryOptions
): Promise<Temperature[]> => {
  const findOptions: FindManyOptions<Temperature> = {};

  // Ensure relations are included if requested in fields
  findOptions.relations = {};

  // Apply filters with the parsed conditions
  if (options.filters) {
    findOptions.where = options.filters;
  }

  // Apply sorting
  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = { [field]: order } as FindOptionsOrder<Temperature>;
  }

  // Apply pagination
  if (options.pagination) {
    const { page, limit } = options.pagination;
    findOptions.skip = (page - 1) * limit;
    findOptions.take = limit;
  }

  // Apply field selection
  if (options.fields) {
    const validFields = validateFields(options.fields);
    findOptions.select = validFields;
  }

  return await temperatureRepository.find(findOptions);
};
