import { ReadlineParser } from '@serialport/parser-readline';
import config from 'config';
import { SerialPort, SerialPortOpenOptions } from 'serialport';
import { setInterval } from 'timers';
import { createSensor } from './sensors.service';
require('dotenv').config();

const arduinoConfig = config.get<{ baudRate: string; comPort: string }>(
  'serialPortConfig'
);

const serialPortOptions: SerialPortOpenOptions<any> = {
  path: arduinoConfig.comPort,
  baudRate: parseInt(arduinoConfig.baudRate, 10),
};

const arduinoPort = new SerialPort(serialPortOptions);
const parser = new ReadlineParser({ delimiter: '\r\n' });

arduinoPort.pipe(parser);

const dataBuffer: any[] = []; // Buffer to hold incoming data

arduinoPort.on('open', () => {
  console.log(`Connected to Arduino on ${arduinoConfig.comPort}`);
});

function getBrazilianSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (
    (month === 12 && day >= 21) ||
    (month >= 1 && month <= 2) ||
    (month === 3 && day <= 20)
  ) {
    return 'Summer';
  } else if (
    (month === 3 && day >= 21) ||
    (month >= 4 && month <= 5) ||
    (month === 6 && day <= 20)
  ) {
    return 'Fall';
  } else if (
    (month === 6 && day >= 21) ||
    (month >= 7 && month <= 8) ||
    (month === 9 && day <= 22)
  ) {
    return 'Winter';
  } else {
    return 'Spring';
  }
}

// Handle incoming data
parser.on('data', (data: any) => {
  // Trim extra whitespace or non-printable characters
  data = data.trim();

  // Validate JSON structure
  if (data === '') {
    console.warn('Received empty data');
    return;
  }

  console.log('Raw data received:', data);

  try {
    const parsedData = JSON.parse(data);

    // Ensure required fields are present
    if (!parsedData.temperature || !parsedData.humidity) {
      console.warn('Incomplete data:', parsedData);
      return;
    }

    const sensorData = {
      temperature: parseFloat(parsedData.temperature),
      humidity: parseFloat(parsedData.humidity),
      season: getBrazilianSeason(),
    };

    if (isNaN(sensorData.temperature) || isNaN(sensorData.humidity)) {
      console.warn('Parsed NaN values:', sensorData);
      return; // Skip invalid data
    }

    dataBuffer.push(sensorData);
    console.log('Data from arduino:', data);
    console.log('Data added to buffer:', sensorData);
  } catch (err: any) {
    console.error('Error processing data from Arduino:', err);
  }
});

// Periodically insert data into the database
setInterval(async () => {
  if (dataBuffer.length === 0) {
    return;
  }

  try {
    const results = [];
    while (dataBuffer.length > 0) {
      const sensorData = dataBuffer.shift();
      const result = await createSensor(sensorData);
      results.push(result);
    }

    console.log('Data inserted successfully:', results);
  } catch (err: any) {
    console.error('Error inserting data into the database:', err);
  }
}, 10000); // Insert data every 10 seconds

arduinoPort.on('error', (err) => {
  console.error('Serial port error:', err);
});
