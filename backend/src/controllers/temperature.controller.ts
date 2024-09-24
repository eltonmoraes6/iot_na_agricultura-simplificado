import { NextFunction, Request, Response } from 'express';
import { CreateTemperatureInput } from '../schemas/temperature.schema';
import {
  createTemperature,
  findOne,
  findTemperatureById,
  findTemperaturesAdvanced,
} from '../services/temperature.service';
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

    const temperatures = await findTemperaturesAdvanced(queryOptions);

    res.status(200).json({
      status: 'success',
      results: temperatures.length,
      data: {
        temperatures,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const findTemperatureByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.temperatureId) {
      res.status(500).json({ message: 'Error' });
    }
    const temperature = await findTemperatureById(req.params.temperatureId);

    res.status(200).json({
      status: 'success',
      data: {
        temperature,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const findLatestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const temperature = await findOne();
    res.status(200).json({
      status: 'success',
      data: {
        temperature,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const registerTemperatureHandler = async (
  req: Request<{}, {}, CreateTemperatureInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const temperature = await createTemperature({
      temperature: req.body.temperature,
    });

    res.status(201).json({
      status: 'success',
      data: {
        temperature,
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
