import { DeepPartial, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { Season } from '../entities/season.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const seasonRepository = AppDataSource.getRepository(Season);

export const createSeason = async (input: DeepPartial<Season>) => {
  return seasonRepository.save(seasonRepository.create(input));
};

export const findSeasonById = async (temperatureId: string) => {
  return await seasonRepository.findOne({
    where: { id: temperatureId },
    relations: {},
  });
};

const validateFields = (fields: string[]): (keyof Season)[] => {
  const validFields: (keyof Season)[] = [
    'id',
    'season',
    'created_at',
    'updated_at',
  ];
  return fields.filter((field) =>
    validFields.includes(field as keyof Season)
  ) as (keyof Season)[];
};

export const findSeasonsAdvanced = async (
  options: QueryOptions
): Promise<Season[]> => {
  const findOptions: FindManyOptions<Season> = {};

  // Ensure relations are included if requested in fields
  findOptions.relations = {};

  // Apply filters with the parsed conditions
  if (options.filters) {
    findOptions.where = options.filters;
  }

  // Apply sorting
  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = { [field]: order } as FindOptionsOrder<Season>;
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

  return await seasonRepository.find(findOptions);
};
