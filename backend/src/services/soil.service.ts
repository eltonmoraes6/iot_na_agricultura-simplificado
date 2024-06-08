import { DeepPartial, FindManyOptions } from 'typeorm';
import { Soil } from '../entities/soil.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const soilRepository = AppDataSource.getRepository(Soil);

//Deficiência de Água (DA) =>	Quantidade de água disponível para as plantas => DA = CC - Umidade Atual do solo
export const waterDeficiency = async (
  currentHumidity: number,
  fieldCapacity: number
) => {
  //soil.maxHumidity - Soil.humidity[0] => ASC
  const waterDeficiency = fieldCapacity - currentHumidity;
  return waterDeficiency;
};

export const potentialEvapotranspiration = async (kc: number, eto: number) => {
  const potentialEvapotranspiration = kc * eto;
  return potentialEvapotranspiration;
};
// Ponto de Murcha Permanente => PMP => Limite mínimo de umidade do solo para as plantas
export const permanentWiltingPoint = async (soilType: string) => {
  const soil = await soilRepository.findOneBy({ soilType: soilType });
  if (soil) {
    return soil.minHumidity;
  }
  throw new Error('Soil type not found');
};
// Capacidade de Campo => CC => Limite máximo de umidade do solo para as plantas
export const fieldCapacity = async (soilType: string) => {
  const soil = await soilRepository.findOneBy({ soilType: soilType });
  if (soil) {
    return soil.maxHumidity;
  }
  throw new Error('Soil type not found');
};

enum SoilType {
  LATOSSOLOS = 'Latossolos',
  ARGISSOLOS = 'Argissolos',
  NEOSSOLOS = 'Neossolos',
}

// Monitoramento de Estresse Térmico
export const idealTemperatureAverage = async (soilType: SoilType) => {
  console.log('soilType back =======> ', soilType);
  const soil = await soilRepository.findOne({ where: { soilType } });
  console.log('Soil found: ', soil);

  if (soil) {
    const minTemperature = parseFloat(soil.minTemperature as unknown as string);
    const maxTemperature = parseFloat(soil.maxTemperature as unknown as string);
    const idealTemperature = (maxTemperature + minTemperature) / 2;

    return { idealTemperature };
  }
  throw new Error('Soil type not found');
};

export const createSoil = async (input: DeepPartial<Soil>) => {
  return soilRepository.save(soilRepository.create(input));
};

export const findSoilById = async (soilId: string) => {
  return await soilRepository.findOne({
    where: { id: soilId },
    relations: { sensor: true },
  });
};

export const findSoil = async (query: FindManyOptions<Soil>) => {
  // Modify the query object to include the limit of 10
  const modifiedQuery: FindManyOptions<Soil> = {
    ...query,
    take: 10,
    relations: {
      sensor: true,
    },
  };
  // Call the find method of SoilRepository with the modified query
  return await soilRepository.find(modifiedQuery);
};

const validSoilKeys = [
  'id',
  'minHumidity',
  'maxHumidity',
  'minTemperature',
  'maxTemperature',
  'soilType',
  'created_at',
  'updated_at',
  'sensor',
] as const;

type ValidSensorKeys = (typeof validSoilKeys)[number];

const validateFields = (fields: string[]): ValidSensorKeys[] => {
  return fields.filter((field): field is ValidSensorKeys =>
    validSoilKeys.includes(field as ValidSensorKeys)
  );
};

export const findSoilAdvanced = async (
  options: QueryOptions
): Promise<Soil[]> => {
  const findOptions: FindManyOptions<Soil> = {};

  // Apply filters with the parsed conditions
  if (options.filters) {
    findOptions.where = options.filters;
  }

  // Apply sorting
  if (options.sort) {
    const { field, order } = options.sort;
    findOptions.order = { [field]: order };
  } else {
    findOptions.order = { created_at: 'DESC' };
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
