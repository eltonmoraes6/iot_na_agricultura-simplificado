import { DeepPartial, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { WaterFlowIndicator } from '../entities/waterFlowIndicator.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const waterFlowIndicatorRepository =
  AppDataSource.getRepository(WaterFlowIndicator);

export const createWaterFlowIndicator = async (
  input: DeepPartial<WaterFlowIndicator>
) => {
  const waterFlowIndicator = waterFlowIndicatorRepository.create(input);
  return await waterFlowIndicatorRepository.save(waterFlowIndicator);
};

export const getWaterFlowIndicatorById = async (id: string) => {
  return await waterFlowIndicatorRepository.findOne({ where: { id } });
};

export const updateWaterFlowIndicator = async (
  id: string,
  input: DeepPartial<WaterFlowIndicator>
) => {
  const waterFlowIndicator = await getWaterFlowIndicatorById(id);
  if (!waterFlowIndicator) throw new Error('Water Flow Indicator not found');

  Object.assign(waterFlowIndicator, input);
  return await waterFlowIndicatorRepository.save(waterFlowIndicator);
};

export const getAllWaterFlowIndicators = async () => {
  return await waterFlowIndicatorRepository.find();
};

export const findOne = async () => {
  const options: FindManyOptions<WaterFlowIndicator> = {
    take: 1,
    order: { created_at: 1 },
    relations: {},
  };
  return await waterFlowIndicatorRepository.find(options);
};

const validateFields = (fields: string[]): (keyof WaterFlowIndicator)[] => {
  const validFields: (keyof WaterFlowIndicator)[] = [
    'id',
    'totalWaterUsed',
    'isIrrigated',
    'startIrrigationTime',
    'stopIrrigationTime',
    'created_at',
    'updated_at',
  ];
  return fields.filter((field) =>
    validFields.includes(field as keyof WaterFlowIndicator)
  ) as (keyof WaterFlowIndicator)[];
};

export const findWaterFlowIndicatorAdvanced = async (
  options: QueryOptions
): Promise<WaterFlowIndicator[]> => {
  const findOptions: FindManyOptions<WaterFlowIndicator> = {};

  // Ensure relations are included if requested in fields
  findOptions.relations = {};

  // Apply filters with the parsed conditions
  if (options.filters) {
    findOptions.where = options.filters;
  }

  // Apply sorting
  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = {
      [field]: order,
    } as FindOptionsOrder<WaterFlowIndicator>;
  }
  WaterFlowIndicator;

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

  return await waterFlowIndicatorRepository.find(findOptions);
};
