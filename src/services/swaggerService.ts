import axios from 'axios';
import SwaggerParser from '@apidevtools/swagger-parser';
import * as crypto from 'crypto';
import { SwaggerSpec } from '../types';
import { Logger } from '../utils/logger';

export class SwaggerService {
  private swaggerUrl: string;
  private rawSpec: any = null; // Store raw spec for hashing

  constructor(swaggerUrl: string) {
    this.swaggerUrl = swaggerUrl;
  }

  async fetchSwagger(): Promise<SwaggerSpec> {
    try {
      Logger.info(`Fetching Swagger spec from: ${this.swaggerUrl}`);
      const response = await axios.get(this.swaggerUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      });

      // Store raw spec for hashing and conversion
      this.rawSpec = response.data;

      // Basic validation without dereferencing
      if (!response.data.openapi && !response.data.swagger) {
        throw new Error('Invalid OpenAPI/Swagger spec: missing version field');
      }

      if (!response.data.info || !response.data.paths) {
        throw new Error('Invalid OpenAPI/Swagger spec: missing required fields');
      }

      Logger.success('Swagger spec fetched and validated successfully');
      
      return response.data as SwaggerSpec;
    } catch (error: any) {
      Logger.error('Failed to fetch Swagger spec', error);
      throw new Error(`Failed to fetch Swagger spec: ${error.message}`);
    }
  }

  generateHash(spec?: SwaggerSpec): string {
    // Use raw spec for hashing to avoid circular reference issues
    // The raw spec is what we care about for change detection
    const dataToHash = this.rawSpec || spec;
    
    try {
      const specString = JSON.stringify(dataToHash);
      return crypto.createHash('sha256').update(specString).digest('hex');
    } catch (error) {
      // Fallback: if still circular, use a custom stringifier
      const specString = this.stringifyWithCircular(dataToHash);
      return crypto.createHash('sha256').update(specString).digest('hex');
    }
  }

  private stringifyWithCircular(obj: any): string {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    });
  }

  hasChanged(spec: SwaggerSpec, previousHash: string | null): boolean {
    if (!previousHash) {
      return true; // First time, always consider as changed
    }

    const currentHash = this.generateHash(spec);
    return currentHash !== previousHash;
  }

  getRawSpec(): any {
    return this.rawSpec;
  }
}

