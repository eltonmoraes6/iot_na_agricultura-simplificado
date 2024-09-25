import { NextFunction, Request, Response } from 'express';
import { getConfigData, getLogData } from '../services/settings.service';

// Handler to get configuration data
export const getConfigHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const configData = getConfigData();
    res.status(200).json({
      status: 'success',
      data: { configData },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

// Handler to get log data (error or combined)
export const getLogHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { logType } = req.params;
    if (logType !== 'error' && logType !== 'combined') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid log type. Use either "error" or "combined".',
      });
    }

    const logs = getLogData(logType as 'error' | 'combined');
    res.status(200).json({
      status: 'success',
      data: { logs },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
