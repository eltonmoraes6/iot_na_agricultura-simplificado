import { NextFunction, Request, Response } from 'express';
import { IAlert } from '../interfaces/alert.interface';
import { predictPestsAndDiseases } from '../services/pestsPrediction.service';
import { findSensorsAdvanced } from '../services/sensors.service';

export const getPestsAndDiseasesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const soil = await findSensorsAdvanced({});

    const alerts: IAlert[] = predictPestsAndDiseases(
      soil.map((s) => ({
        id: s.id,
        temperature: s.temperature,
        humidity: s.humidity,
      }))
    );

    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};
