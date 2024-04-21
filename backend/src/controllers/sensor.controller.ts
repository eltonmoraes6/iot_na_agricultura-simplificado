import { NextFunction, Request, Response } from 'express';
import { CreateSensorInput } from '../schemas/sensor.schema';
import {
  createSensor,
  findSensor,
  findSensorBySeason,
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
};
