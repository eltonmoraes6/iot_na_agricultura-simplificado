import MultivariateLinearRegression from 'ml-regression-multivariate-linear';
import { DeepPartial, FindManyOptions } from 'typeorm';

import { Sensor } from '../entities/sensor.entity';
import { Soil } from '../entities/soil.entity';
import { AppDataSource } from '../utils/data-source';
import { QueryOptions } from '../utils/types';

const sensorRepository = AppDataSource.getRepository(Sensor);
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
  const soil = await soilRepository.findOne({ where: { soilType } });
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

  // Ensure relations are included if requested in fields
  findOptions.relations = { sensor: true };

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

export const soilHumidityLimits = async (): Promise<unknown> => {
  const soils = await soilRepository.find({
    relations: {
      sensor: true,
    },
  });

  const results = soils.map((soil) => {
    const { minHumidity, maxHumidity, minTemperature, maxTemperature } = soil;

    const sensorData = soil.sensor.map((sensor) => ({
      temperature: sensor.temperature,
      humidity: sensor.humidity,
      season: sensor.season,
    }));

    return {
      soilType: soil.soilType,
      minHumidity,
      maxHumidity,
      minTemperature,
      maxTemperature,
      sensorData,
    };
  });

  return results;
};

export const idealTemperatures = async (): Promise<unknown> => {
  const sensors = await sensorRepository.find({
    relations: {
      soil: true,
    },
  });

  // Filter out invalid data and convert strings to numbers
  const validSensors = sensors.filter(
    (sensor) =>
      !isNaN(Number(sensor.humidity)) &&
      !isNaN(Number(sensor.soil.minTemperature)) &&
      !isNaN(Number(sensor.soil.maxTemperature)) &&
      !isNaN(Number(sensor.soil.minHumidity)) &&
      !isNaN(Number(sensor.soil.maxHumidity))
  );

  if (validSensors.length === 0) {
    throw new Error('No valid sensor data available');
  }

  // Prepare data for regression
  const inputs = validSensors.map((sensor) => [Number(sensor.humidity)]);
  const outputsMinTemp = validSensors.map((sensor) => [
    Number(sensor.soil.minTemperature),
  ]);
  const outputsMaxTemp = validSensors.map((sensor) => [
    Number(sensor.soil.maxTemperature),
  ]);

  // Train regression models
  const regressionMinTemp = new MultivariateLinearRegression(
    inputs,
    outputsMinTemp
  );
  const regressionMaxTemp = new MultivariateLinearRegression(
    inputs,
    outputsMaxTemp
  );

  // Predict temperatures for average humidity levels
  const avgMinHumidity =
    validSensors.reduce(
      (acc, sensor) => acc + Number(sensor.soil.minHumidity),
      0
    ) / validSensors.length;
  const avgMaxHumidity =
    validSensors.reduce(
      (acc, sensor) => acc + Number(sensor.soil.maxHumidity),
      0
    ) / validSensors.length;

  const predictedMinTemperature = regressionMinTemp.predict([avgMinHumidity]);
  const predictedMaxTemperature = regressionMaxTemp.predict([avgMaxHumidity]);

  return {
    predictedMinTemperature: predictedMinTemperature[0],
    predictedMaxTemperature: predictedMaxTemperature[0],
  };
};

export const calculateAndSaveSoilHumidityLimits = async (): Promise<any> => {
  const sensors = await sensorRepository.find({
    relations: { soil: true },
  });
  // Filtrar dados inválidos e converter strings para números
  const validSensors = sensors.filter(
    (sensor) => !isNaN(Number(sensor.humidity))
  );

  if (validSensors.length === 0) {
    throw new Error('No valid sensor data available');
  }

  // Preparar dados para regressão
  const inputs = validSensors.map((sensor) => [Number(sensor.humidity)]);
  const outputsMinTemp = validSensors.map((sensor) => [
    Number(sensor.temperature),
  ]); // Usar temperatura para prever a umidade

  // Treinar o modelo de regressão
  const regressionMinTemp = new MultivariateLinearRegression(
    inputs,
    outputsMinTemp
  );

  // Prever umidades para níveis médios de temperatura
  const avgHumidity =
    validSensors.reduce((acc, sensor) => acc + Number(sensor.humidity), 0) /
    validSensors.length;

  const predictedTemperature: number[][] = regressionMinTemp.predict([
    [avgHumidity],
  ]);

  // Atualizar a entidade Soil com os valores calculados
  for (const sensor of validSensors) {
    const soil = await soilRepository.findOne({
      where: { id: sensor.soil.id },
    });
    if (soil) {
      soil.minHumidity = Math.min(...inputs.map((input) => input[0])); // Ponto de murcha permanente
      soil.maxHumidity = Math.max(...inputs.map((input) => input[0])); // Capacidade de campo
      soil.minTemperature = predictedTemperature[0][0]; // Temperatura mínima prevista
      soil.maxTemperature = predictedTemperature[0][0]; // Temperatura máxima prevista
      await soilRepository.save(soil);
    }
  }

  return {
    minHumidity: Math.min(...inputs.map((input) => input[0])),
    maxHumidity: Math.max(...inputs.map((input) => input[0])),
    predictedTemperature: predictedTemperature[0][0],
  };
};
