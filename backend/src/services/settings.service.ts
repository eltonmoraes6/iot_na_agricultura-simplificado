import fs from 'fs';
import path from 'path';

// Function to read configuration data
export const getConfigData = () => {
  const configPath = path.join(__dirname, '../config/config.json');

  console.log('configPath ====> ', configPath);

  if (!fs.existsSync(configPath)) {
    throw new Error('Configuration file not found');
  }

  const configData = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configData);
};

// Function to read log data
export const getLogData = (logType: 'error' | 'combined') => {
  const logFilePath = path.join(__dirname, `../../logs/${logType}.log`);

  if (!fs.existsSync(logFilePath)) {
    throw new Error(`${logType} log file not found`);
  }

  const logData = fs.readFileSync(logFilePath, 'utf-8');
  return logData;
};
