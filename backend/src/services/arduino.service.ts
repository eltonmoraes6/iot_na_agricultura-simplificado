import { ReadlineParser } from '@serialport/parser-readline';
import config from 'config';
import { SerialPort, SerialPortOptions } from 'serialport';
require('dotenv').config();

const redisConfig = config.get<{
  baudRate: number;
  comPort: string;
}>('serialPortConfig');

// Serial port connection options
const serialPortOptions: SerialPortOptions = {
  path: redisConfig.comPort,
  baudRate: parseInt(redisConfig.baudRate),
};

console.log('redisConfig.baudRate ====>', redisConfig.baudRate);
// Connect to Arduino via serial port
const arduinoPort: SerialPort = new SerialPort(serialPortOptions);

const parser = new ReadlineParser({ delimiter: '\r\n' });

// Attach parser to the Arduino port
arduinoPort.pipe(parser);

// Handle Arduino port open event
arduinoPort.on('open', () => {
  console.log(`Connected to Arduino on ${redisConfig.comPort}`);
});

// Listen for data from Arduino
parser.on('data', (data: string) => {
  try {
    console.log('Raw data received from Arduino:', data);

    // Split the received data by a delimiter (e.g., comma)
    const [temperatureStr, humidityStr] = data.split(',');

    // Convert strings to numbers
    const temperature: number = parseFloat(temperatureStr);
    const humidity: number = parseFloat(humidityStr);

    const sensor = { temperature, humidity };

    console.log('Arduino Info: ', sensor);
  } catch (err: any) {
    console.error('Error inserting data into PostgreSQL:', err);
  }
});

// Handle serial port errors
parser.on('error', (err) => {
  console.error('Serial port error:', err);
});
