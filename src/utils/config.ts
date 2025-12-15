import * as fs from 'fs';
import * as path from 'path';
import { Config } from '../types';

const CONFIG_FILE = path.join(process.cwd(), '.postman-updater.json');

export class ConfigManager {
  static save(config: Config): void {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  }

  static load(): Config | null {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      // Config file doesn't exist or is invalid
    }
    return null;
  }

  static exists(): boolean {
    return fs.existsSync(CONFIG_FILE);
  }
}

export class CacheManager {
  private static CACHE_FILE = path.join(process.cwd(), '.swagger-cache.json');

  static save(hash: string): void {
    fs.writeFileSync(this.CACHE_FILE, JSON.stringify({ hash, timestamp: Date.now() }));
  }

  static load(): { hash: string; timestamp: number } | null {
    try {
      if (fs.existsSync(this.CACHE_FILE)) {
        const data = fs.readFileSync(this.CACHE_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      // Cache file doesn't exist or is invalid
    }
    return null;
  }
}

