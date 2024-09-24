import { NextFunction, Request, Response } from 'express';
import { CreateSeasonInput } from '../schemas/season.schema';
import {
  createSeason,
  findSeasonById,
  findSeasonsAdvanced,
} from '../services/season.service';
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

    const sensors = await findSeasonsAdvanced(queryOptions);

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
    const sensors = await findSeasonById(season);

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

export const registerSeasonHandler = async (
  req: Request<{}, {}, CreateSeasonInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const season = await createSeason({ season: req.body.season });

    res.status(201).json({
      status: 'success',
      data: {
        season,
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
