import { SwaggerSpec, PostmanCollection } from '../types';
import { Logger } from '../utils/logger';

const Converter = require('openapi-to-postmanv2');

export class ConverterService {
  static async convertToPostman(swagger: SwaggerSpec | any): Promise<PostmanCollection> {
    return new Promise((resolve, reject) => {
      Logger.info('Converting Swagger/OpenAPI spec to Postman collection...');

      // Ensure we have valid data
      if (!swagger) {
        return reject(new Error('Swagger spec is null or undefined'));
      }

      // Check if Converter is properly loaded
      if (!Converter || !Converter.convert) {
        return reject(new Error('openapi-to-postmanv2 converter not properly loaded'));
      }

      // Log spec info for debugging
      Logger.info(`Spec format: OpenAPI ${swagger.openapi || swagger.swagger || 'unknown'}`);
      Logger.info(`Spec title: ${swagger.info?.title || 'unknown'}`);

      // Convert directly without validation (validation might be causing issues)
      try {
        Converter.convert(
          { type: 'json', data: swagger },
          {
            folderStrategy: 'Tags',
            requestParametersResolution: 'Example',
            exampleParametersResolution: 'Example',
            optimizeConversion: false, // Disable optimization
            stackLimit: 50
          },
          (error: Error | null, conversionResult: any) => {
            if (error) {
              Logger.error('Conversion failed', error);
              Logger.error('Error details:', JSON.stringify(error, null, 2));
              return reject(error);
            }

            if (!conversionResult || !conversionResult.result) {
              const errorMsg = conversionResult?.reason || 'Unknown conversion error';
              Logger.error('Conversion failed', errorMsg);
              if (conversionResult) {
                Logger.error('Result details:', JSON.stringify(conversionResult, null, 2));
              }
              return reject(new Error(errorMsg));
            }

            Logger.success('Successfully converted to Postman collection');
            
            // Log the structure for debugging
            const output = conversionResult.output[0];
            Logger.info(`Output keys: ${Object.keys(output).join(', ')}`);
            
            resolve(output as PostmanCollection);
          }
        );
      } catch (error: any) {
        Logger.error('Conversion exception', error);
        Logger.error('Stack trace:', error.stack);
        reject(error);
      }
    });
  }
}

