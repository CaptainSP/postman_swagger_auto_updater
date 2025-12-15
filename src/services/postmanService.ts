import axios, { AxiosInstance } from 'axios';
import { PostmanCollection, PostmanCollectionResponse } from '../types';
import { Logger } from '../utils/logger';

export class PostmanService {
  private apiKey: string;
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.getpostman.com',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async validateApiKey(): Promise<boolean> {
    try {
      Logger.info('Validating Postman API key...');
      await this.client.get('/me');
      Logger.success('Postman API key is valid');
      return true;
    } catch (error) {
      Logger.error('Invalid Postman API key');
      return false;
    }
  }

  async createCollection(collection: any): Promise<string> {
    try {
      Logger.info('Creating new Postman collection...');
      
      // Handle the same format as update
      let payload: any;
      
      if (collection.data) {
        payload = { collection: collection.data };
      } else if (collection.collection) {
        payload = collection;
      } else {
        payload = { collection };
      }
      
      const response = await this.client.post<PostmanCollectionResponse>(
        '/collections',
        payload
      );

      const collectionId = response.data.collection.uid;
      Logger.success(`Collection created successfully. ID: ${collectionId}`);
      return collectionId;
    } catch (error: any) {
      Logger.error('Failed to create collection', error);
      
      // Log detailed error info
      if (error.response) {
        Logger.error(`Status: ${error.response.status}`);
        Logger.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      
      throw new Error(`Failed to create collection: ${error.message}`);
    }
  }

  async updateCollection(collectionId: string, collection: any): Promise<void> {
    try {
      Logger.info(`Updating Postman collection: ${collectionId}`);
      
      // Log the collection structure for debugging
      const collectionKeys = Object.keys(collection);
      Logger.info(`Collection keys: ${collectionKeys.join(', ')}`);
      
      // The converter returns {type: 'collection', data: {...}}
      // Postman API expects {collection: {...}}
      let payload: any;
      
      if (collection.data) {
        // Converter v4.x format: {type, data}
        payload = { collection: collection.data };
        Logger.info('Using data property for collection');
      } else if (collection.collection) {
        // Already wrapped
        payload = collection;
        Logger.info('Collection already wrapped');
      } else {
        // Raw collection object
        payload = { collection };
        Logger.info('Wrapping raw collection');
      }
      
      await this.client.put(`/collections/${collectionId}`, payload);
      Logger.success('Collection updated successfully');
    } catch (error: any) {
      Logger.error('Failed to update collection', error);
      
      // Log detailed error info
      if (error.response) {
        Logger.error(`Status: ${error.response.status}`);
        Logger.error(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      
      throw new Error(`Failed to update collection: ${error.message}`);
    }
  }

  async getCollection(collectionId: string): Promise<PostmanCollection | null> {
    try {
      const response = await this.client.get<PostmanCollection>(
        `/collections/${collectionId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        Logger.warn('Collection not found');
        return null;
      }
      throw error;
    }
  }

  async listCollections(): Promise<any[]> {
    try {
      const response = await this.client.get('/collections');
      return response.data.collections || [];
    } catch (error: any) {
      Logger.error('Failed to list collections', error);
      throw new Error(`Failed to list collections: ${error.message}`);
    }
  }
}

