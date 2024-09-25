import { NextFunction, Request, Response } from 'express';
import {
  createWaterFlowIndicator,
  findOne,
  findWaterFlowIndicatorAdvanced,
  getAllWaterFlowIndicators,
  getWaterFlowIndicatorById,
  updateWaterFlowIndicator,
} from '../services/waterFlowIndicator.service';
import { parseFilters } from '../utils/queryParams';

export const createWaterFlowIndicatorController = async (
  req: Request,
  res: Response
) => {
  try {
    const waterFlowIndicator = await createWaterFlowIndicator(req.body);
    res.status(201).json(waterFlowIndicator);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

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

    const waterFlowIndicator = await findWaterFlowIndicatorAdvanced(
      queryOptions
    );

    res.status(200).json({
      status: 'success',
      results: waterFlowIndicator.length,
      data: {
        waterFlowIndicator,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const findLatestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const waterFlowIndicator = await findOne();
    res.status(200).json({
      status: 'success',
      data: {
        waterFlowIndicator,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getWaterFlowIndicatorController = async (
  req: Request,
  res: Response
) => {
  try {
    const waterFlowIndicator = await getWaterFlowIndicatorById(req.params.id);
    if (!waterFlowIndicator) {
      return res
        .status(404)
        .json({ message: 'Water Flow Indicator not found' });
    }
    res.json(waterFlowIndicator);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const updateWaterFlowIndicatorController = async (
  req: Request,
  res: Response
) => {
  try {
    const updatedWaterFlowIndicator = await updateWaterFlowIndicator(
      req.params.id,
      req.body
    );
    res.json(updatedWaterFlowIndicator);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const getAllWaterFlowIndicatorsController = async (
  req: Request,
  res: Response
) => {
  try {
    const waterFlowIndicators = await getAllWaterFlowIndicators();
    res.json(waterFlowIndicators);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
