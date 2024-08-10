import { NextFunction, Request, Response } from 'express';
import { CreateSensorInput } from '../schemas/sensor.schema';
import {
  createSensor,
  findOneSensor,
  findSensorBySeason,
  findSensorsAdvanced,
  getDailyAndPeriodAverages,
} from '../services/sensors.service';
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

    const sensors = await findSensorsAdvanced(queryOptions);

    res.status(200).json({
      status: 'success',
      results: sensors.length,
      data: {
        sensors,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const findSeasonByHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { season } = req.params;

    if (!season) {
      res.status(500).json({ message: 'Error' });
    }
    const sensors = await findSensorBySeason(season);

    res.status(200).json({
      status: 'success',
      data: {
        sensors,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const registerSensorHandler = async (
  req: Request<{}, {}, CreateSensorInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { humidity, season, temperature, soil } = req.body;
    // const soilData = { id: '4d8b5a3d-36c7-4fa1-b3f9-5dd16a1e1103' }; // Assuming 'id' is the primary key
    const sensor = await createSensor({
      humidity,
      season,
      temperature,
      soil: { id: soil },
    });

    res.status(201).json({
      status: 'success',
      data: {
        sensor,
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

export const getDailyAndPeriodAveragesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const averages = await getDailyAndPeriodAverages();

    res.status(200).json({
      status: 'success',
      data: averages,
    });
  } catch (error) {
    next(error);
  }
}; // Type for expected query parameters

export const getLastSensor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensors = await findOneSensor();

    res.status(200).json({
      status: 'success',
      results: sensors.length,
      data: {
        sensors,
      },
    });
  } catch (error) {
    // Handle errors appropriately
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};
