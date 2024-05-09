import { NextFunction, Request, Response } from 'express';
import { CreateSensorInput } from '../schemas/sensor.schema';
import {
  createSensor,
  findSensor,
  findSensorBySeason,
  findSensorsAdvanced,
  getDailyAndPeriodAverages,
} from '../services/sensors.service';

export const indexHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sensors = await findSensor({});

    res.status(200).status(200).json({
      status: 'success',
      data: {
        sensors,
      },
    });
  } catch (err: any) {
    next(err);
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
    const { humidity, season, temperature } = req.body;

    const sensor = await createSensor({
      humidity,
      season,
      temperature,
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
interface SensorQuery {
  [key: string]: any;
}

// Function to parse query parameters with operators
const parseFilters = (query: SensorQuery): SensorQuery => {
  const excludedFields = ['sort', 'sortOrder', 'page', 'limit', 'fields'];
  const filters: SensorQuery = {};

  for (const key in query) {
    if (excludedFields.includes(key)) {
      continue; // Skip excluded fields
    }

    let value = query[key];

    // Handle advanced filtering with operators
    if (
      typeof value === 'string' &&
      value.startsWith('{') &&
      value.endsWith('}')
    ) {
      try {
        value = JSON.parse(value); // Parse JSON-like strings
      } catch (error) {
        throw new Error(`Invalid filter format for key ${key}`);
      }
    }

    if (typeof value === 'object') {
      for (const operator in value) {
        const operatorValue = value[operator];

        switch (operator) {
          case 'eq':
            filters[key] = operatorValue;
            break;
          case 'neq':
            filters[key] = { $ne: operatorValue };
            break;
          case 'gte':
            filters[key] = { $gte: operatorValue };
            break;
          case 'lte':
            filters[key] = { $lte: operatorValue };
            break;
          default:
            throw new Error(`Unknown operator: ${operator}`);
        }
      }
    } else {
      // If no operator, treat it as an exact match
      filters[key] = value;
    }
  }

  return filters;
};

export const getAllSensorsHandler = async (
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
