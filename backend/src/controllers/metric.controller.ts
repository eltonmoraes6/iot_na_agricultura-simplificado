import { NextFunction, Request, Response } from 'express';
import { CreateMetricInput } from '../schemas/metric.schema';
import {
  calculateAverages,
  createMetric,
  findMetricsAdvanced,
  potentialEvapotranspiration,
  waterDeficiency,
} from '../services/metric.service';
import { parseFilters } from '../utils/queryParams';

export const indexHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sort, sortOrder, page, limit, fields } = req.query;

    // Parse filters for metrics
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

    const metrics = await findMetricsAdvanced(queryOptions);

    res.status(200).json({
      status: 'success',
      results: metrics.length,
      data: {
        metrics,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const registerMetricHandler = async (
  req: Request<{}, {}, CreateMetricInput>,
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
      season,
    } = req.body;

    const metric = await createMetric({
      minHumidity,
      maxHumidity,
      minTemperature,
      maxTemperature,
      soilType,
      season,
    });

    res.status(201).json({
      status: 'success',
      data: {
        metric,
      },
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'Metric already exists!',
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

export const getAveragesHandler = async (req: Request, res: Response) => {
  try {
    const averages = await calculateAverages();
    res.status(200).json({
      status: 'success',
      data: { averages },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving daily averages',
      error,
    });
  }
};
