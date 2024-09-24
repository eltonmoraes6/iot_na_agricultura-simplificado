import { NextFunction, Request, Response } from 'express';
import { CreateHumidityInput } from '../schemas/humidity.schema';
import {
  createHumidity,
  findHumidityById,
  findHumiditysAdvanced,
  findOne,
} from '../services/humidity.service';
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

    const humidities = await findHumiditysAdvanced(queryOptions);

    res.status(200).json({
      status: 'success',
      results: humidities.length,
      data: {
        humidities,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const findHumidityByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.humidityId) {
      res.status(500).json({ message: 'Error' });
    }
    const humidity = await findHumidityById(req.params.humidityId);

    res.status(200).json({
      status: 'success',
      data: {
        humidity,
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
    const humidity = await findOne();
    res.status(200).json({
      status: 'success',
      data: {
        humidity,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const registerHumidityHandler = async (
  req: Request<{}, {}, CreateHumidityInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const humidity = await createHumidity({ humidity: req.body.humidity });

    res.status(201).json({
      status: 'success',
      data: {
        humidity,
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
