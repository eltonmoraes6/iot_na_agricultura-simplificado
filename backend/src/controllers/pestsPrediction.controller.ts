import { NextFunction, Request, Response } from 'express';
import { predictPestsAndDiseases } from '../services/pestsPrediction.service';

export const getPestsAndDiseasesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const alerts = await predictPestsAndDiseases();

    res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
};
