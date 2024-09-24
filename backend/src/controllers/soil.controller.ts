import { NextFunction, Request, Response } from 'express';
import { CreateSoilInput } from '../schemas/soil.schema';
import {
  createSoil,
  findSoilById,
  findSoilsAdvanced,
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

    const soils = await findSoilsAdvanced(queryOptions);

    res.status(200).json({
      status: 'success',
      results: soils.length,
      data: {
        soils,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const findSoilByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.soilId) {
      res.status(500).json({ message: 'Error' });
    }
    const soil = await findSoilById(req.params.soilId);

    res.status(200).json({
      status: 'success',
      data: {
        soil,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const registerSoilHandler = async (
  req: Request<{}, {}, CreateSoilInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const soil = await createSoil({ soilType: req.body.soilType });

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
