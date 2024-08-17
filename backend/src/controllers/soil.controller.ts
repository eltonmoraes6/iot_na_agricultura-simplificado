import { NextFunction, Request, Response } from 'express';
import { CreateSoilInput } from '../schemas/soil.schema';
import {
  calculateAndSaveSoilHumidityLimits,
  createSoil,
  findSoilAdvanced,
  idealHumidityAverage,
  idealTemperatureAverage,
  idealTemperatures,
  potentialEvapotranspiration,
  soilHumidityLimits,
  waterDeficiency,
} from '../services/soil.service';
import { parseFilters } from '../utils/queryParams';

export const indexHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sort, sortOrder, page, limit, fields } = req.query;

    // Parse filters with error handling for proper conversion to numeric
    const filters = parseFilters(req.query);

    const queryOptions = {
      filters,
      sort: sort
        ? {
            field: sort as string,
            order: (sortOrder as 'ASC' | 'DESC') || 'ASC',
          }
        : undefined,
      pagination: {
        page: parseInt(page as string, 10) || 1,
        limit: parseInt(limit as string, 10) || 10,
      },
      fields: fields ? (fields as string).split(',') : undefined,
    };

    const soil = await findSoilAdvanced(queryOptions);

    res.status(200).json({
      status: 'success',
      results: soil.length,
      data: {
        soil,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const registerSoilHandler = async (
  req: Request<{}, {}, CreateSoilInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      minHumidity,
      maxHumidity,
      minTemperature,
      maxTemperature,
      soilType,
    } = req.body;

    const soil = await createSoil({
      minHumidity,
      maxHumidity,
      minTemperature,
      maxTemperature,
      soilType,
    });

    res.status(201).json({
      status: 'success',
      data: {
        soil,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'something went wrong!',
      });
    }
    next(err);
  }
};

export const calculateWaterDeficiency = async (req: Request, res: Response) => {
  try {
    const { currentHumidity, fieldCapacity } = req.body;
    const deficiency = await waterDeficiency(currentHumidity, fieldCapacity);
    res.status(200).json({ deficiency });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error calculating water deficiency', error });
  }
};

export const calculatePotentialEvapotranspiration = async (
  req: Request,
  res: Response
) => {
  try {
    const { kc, eto } = req.body;
    const etp = await potentialEvapotranspiration(kc, eto);
    res.status(200).json({ etp });
  } catch (error) {
    res.status(500).json({
      message: 'Error calculating potential evapotranspiration',
      error,
    });
  }
};

export const getIdealHumidity = async (req: Request, res: Response) => {
  try {
    const { soilType } = req.body;
    const idealHumidity = await idealHumidityAverage(soilType);
    res.status(200).json(idealHumidity);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting ideal humidity', error });
  }
};

export const getIdealTemperature = async (req: Request, res: Response) => {
  try {
    const { soilType } = req.body;
    const idealTemperature = await idealTemperatureAverage(soilType);
    res.status(200).json(idealTemperature);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting ideal temperature', error });
  }
};

export const getSoilHumidityLimits = async (req: Request, res: Response) => {
  try {
    const data = await soilHumidityLimits();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error get soil humidity limits', error });
  }
};

export const predictIdealTemperatures = async (req: Request, res: Response) => {
  try {
    const data = await idealTemperatures();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error predict ideal temperature', error });
  }
};

export const calculateSoilHumidityLimits = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await calculateAndSaveSoilHumidityLimits();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error calculate humidity limits', error });
  }
};
