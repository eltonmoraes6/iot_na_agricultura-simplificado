import { DeepPartial, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { Soil } from '../entities/soil.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const soilRepository = AppDataSource.getRepository(Soil);

export const createSoil = async (input: DeepPartial<Soil>) => {
  return soilRepository.save(soilRepository.create(input));
};

export const findSoilById = async (temperatureId: string) => {
  return await soilRepository.findOne({
    where: { id: temperatureId },
    relations: {},
  });
};

const validateFields = (fields: string[]): (keyof Soil)[] => {
  const validFields: (keyof Soil)[] = [
    'id',
    'soil' as keyof Soil, // Type assertion
    'created_at',
    'updated_at',
  ];
  return fields.filter((field) =>
    validFields.includes(field as keyof Soil)
  ) as (keyof Soil)[];
};

export const findSoilsAdvanced = async (
  options: QueryOptions
): Promise<Soil[]> => {
  const findOptions: FindManyOptions<Soil> = {};

  // Ensure relations are included if requested in fields
  findOptions.relations = {};

  // Apply filters with the parsed conditions
  if (options.filters) {
    findOptions.where = options.filters;
  }

  // Apply sorting
  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = { [field]: order } as FindOptionsOrder<Soil>;
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

  return await soilRepository.find(findOptions);
};
