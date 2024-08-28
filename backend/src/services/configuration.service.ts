import fs from 'fs';
import path from 'path';

const configFilePath = path.join(__dirname, '../config/config.json');

export function loadConfig(): any {
  if (fs.existsSync(configFilePath)) {
    return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  }
  return {};
}

export function saveConfig(config: any): void {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}
