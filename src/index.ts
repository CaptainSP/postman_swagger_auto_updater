import inquirer from 'inquirer';
import { SwaggerService } from './services/swaggerService';
import { PostmanService } from './services/postmanService';
import { ConverterService } from './services/converterService';
import { ConfigManager, CacheManager } from './utils/config';
import { Logger } from './utils/logger';
import { Config } from './types';

class PostmanUpdater {
  private config!: Config;
  private swaggerService!: SwaggerService;
  private postmanService!: PostmanService;
  private isRunning: boolean = false;

  async initialize(): Promise<void> {
    Logger.log('\n🚀 Postman Updater - Swagger to Postman Sync Tool\n');
    Logger.separator();

    // Try to load existing config
    const existingConfig = ConfigManager.load();

    if (existingConfig) {
      Logger.info('Found existing configuration');
      const { useExisting } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useExisting',
          message: 'Use existing configuration?',
          default: true
        }
      ]);

      if (useExisting) {
        this.config = existingConfig;
        Logger.success('Using existing configuration');
      } else {
        this.config = await this.promptForConfig();
      }
    } else {
      this.config = await this.promptForConfig();
    }

    // Initialize services
    this.swaggerService = new SwaggerService(this.config.swaggerUrl);
    this.postmanService = new PostmanService(this.config.postmanApiKey);

    // Validate Postman API key (only if using existing config)
    if (existingConfig && (this.config === existingConfig)) {
      const isValid = await this.postmanService.validateApiKey();
      if (!isValid) {
        throw new Error('Invalid Postman API key. Please check your credentials.');
      }
    }

    // Save config
    ConfigManager.save(this.config);
    Logger.success('Configuration saved');
  }

  private async promptForConfig(): Promise<Config> {
    Logger.info('Please provide the following information:\n');

    // First, get Swagger URL and API key
    const basicAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'swaggerUrl',
        message: 'Swagger/OpenAPI JSON URL:',
        validate: (input: string) => {
          if (!input) return 'URL is required';
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'password',
        name: 'postmanApiKey',
        message: 'Postman API Key:',
        validate: (input: string) => input ? true : 'API Key is required'
      }
    ]);

    // Validate API key and fetch collections
    Logger.info('Validating API key and fetching collections...');
    const tempPostmanService = new PostmanService(basicAnswers.postmanApiKey);
    
    const isValid = await tempPostmanService.validateApiKey();
    if (!isValid) {
      throw new Error('Invalid Postman API key. Please check your credentials.');
    }

    let collectionId: string | undefined;

    try {
      const collections = await tempPostmanService.listCollections();
      
      if (collections.length > 0) {
        Logger.success(`Found ${collections.length} collection(s) in your workspace\n`);

        // Create choices for inquirer
        const choices = [
          { name: '➕ Create a new collection', value: 'new' },
          new inquirer.Separator('─── Existing Collections ───')
        ];

        // Add existing collections
        collections.forEach((col: any) => {
          choices.push({
            name: `${col.name} (ID: ${col.uid})`,
            value: col.uid
          });
        });

        const { selectedCollection } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedCollection',
            message: 'Select a Postman collection:',
            choices: choices,
            pageSize: 10
          }
        ]);

        if (selectedCollection !== 'new') {
          collectionId = selectedCollection;
          Logger.success(`Selected collection: ${collectionId}`);
        } else {
          Logger.info('Will create a new collection');
        }
      } else {
        Logger.info('No existing collections found. Will create a new one.');
      }
    } catch (error) {
      Logger.warn('Could not fetch collections, will create a new one');
    }

    // Get poll interval
    const { pollInterval } = await inquirer.prompt([
      {
        type: 'number',
        name: 'pollInterval',
        message: 'Poll interval in seconds (how often to check for changes):',
        default: 300,
        validate: (input: number) => {
          if (input < 10) return 'Minimum interval is 10 seconds';
          return true;
        }
      }
    ]);

    return {
      swaggerUrl: basicAnswers.swaggerUrl,
      postmanApiKey: basicAnswers.postmanApiKey,
      collectionId: collectionId,
      pollInterval: pollInterval
    };
  }

  async syncOnce(): Promise<void> {
    try {
      Logger.separator();
      Logger.info(`Checking for changes... ${new Date().toLocaleString()}`);

      // Fetch Swagger spec
      const swagger = await this.swaggerService.fetchSwagger();

      // Check if changed
      const cache = CacheManager.load();
      const currentHash = this.swaggerService.generateHash(swagger);

      if (cache && cache.hash === currentHash) {
        Logger.info('No changes detected in Swagger spec');
        return;
      }

      Logger.warn('Changes detected! Updating Postman collection...');

      // Convert to Postman format (use raw spec for conversion)
      const rawSpec = this.swaggerService.getRawSpec();
      if (!rawSpec) {
        throw new Error('Raw spec is not available');
      }
      
      Logger.info(`Using raw spec for conversion (${Object.keys(rawSpec).length} keys)`);
      const postmanCollection = await ConverterService.convertToPostman(rawSpec);

      // Update or create collection
      if (this.config.collectionId) {
        // Check if collection exists
        const existingCollection = await this.postmanService.getCollection(this.config.collectionId);
        
        if (existingCollection) {
          // Log changes
          this.logCollectionChanges(existingCollection, postmanCollection);
          
          await this.postmanService.updateCollection(this.config.collectionId, postmanCollection);
        } else {
          Logger.warn('Collection not found, creating new one...');
          const newId = await this.postmanService.createCollection(postmanCollection);
          this.config.collectionId = newId;
          ConfigManager.save(this.config);
        }
      } else {
        // Create new collection
        const newId = await this.postmanService.createCollection(postmanCollection);
        this.config.collectionId = newId;
        ConfigManager.save(this.config);
      }

      // Save hash to cache
      CacheManager.save(currentHash);
      Logger.success('Postman collection synchronized successfully! ✨');

    } catch (error: any) {
      Logger.error('Sync failed', error);
      throw error;
    }
  }

  async startWatching(): Promise<void> {
    this.isRunning = true;

    Logger.separator();
    Logger.success(`Started monitoring Swagger API for changes...`);
    Logger.info(`Checking every ${this.config.pollInterval} seconds`);
    Logger.info('Press Ctrl+C to stop\n');

    // Run initial sync
    await this.syncOnce();

    // Set up polling
    const intervalId = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(intervalId);
        return;
      }

      try {
        await this.syncOnce();
      } catch (error) {
        Logger.error('Error during sync, will retry on next interval');
      }
    }, this.config.pollInterval * 1000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      Logger.log('\n');
      Logger.info('Stopping...');
      this.isRunning = false;
      clearInterval(intervalId);
      Logger.success('Stopped successfully');
      process.exit(0);
    });
  }

  private logCollectionChanges(existingCollection: any, newCollection: any): void {
    Logger.separator();
    Logger.info('📊 Collection Changes:');
    
    try {
      // Extract the actual collection data
      const oldData = existingCollection.collection || existingCollection.data || existingCollection;
      const newData = newCollection.data || newCollection.collection || newCollection;
      
      // Count endpoints
      const oldEndpoints = this.countEndpoints(oldData);
      const oldFolders = this.countFolders(oldData);
      
      const newEndpoints = this.countEndpoints(newData);
      const newFolders = this.countFolders(newData);
      
      // Log changes
      if (oldEndpoints !== newEndpoints) {
        const diff = newEndpoints - oldEndpoints;
        const symbol = diff > 0 ? '📈' : '📉';
        Logger.info(`${symbol} Endpoints: ${oldEndpoints} → ${newEndpoints} (${diff > 0 ? '+' : ''}${diff})`);
      } else {
        Logger.info(`✓ Endpoints: ${newEndpoints} (no change)`);
      }
      
      if (oldFolders !== newFolders) {
        const diff = newFolders - oldFolders;
        const symbol = diff > 0 ? '📁' : '📂';
        Logger.info(`${symbol} Folders: ${oldFolders} → ${newFolders} (${diff > 0 ? '+' : ''}${diff})`);
      } else {
        Logger.info(`✓ Folders: ${newFolders} (no change)`);
      }
      
      // Check version change
      const oldVersion = oldData.info?.version || 'unknown';
      const newVersion = newData.info?.version || 'unknown';
      
      if (oldVersion !== newVersion) {
        Logger.info(`🔄 Version: ${oldVersion} → ${newVersion}`);
      }
      
      Logger.separator();
    } catch (error) {
      Logger.warn('Could not compare collections');
    }
  }
  
  private countEndpoints(collection: any): number {
    let count = 0;
    
    const countItems = (items: any[]): void => {
      if (!items) return;
      
      for (const item of items) {
        if (item.request) {
          // This is an endpoint
          count++;
        } else if (item.item) {
          // This is a folder
          countItems(item.item);
        }
      }
    };
    
    if (collection.item) {
      countItems(collection.item);
    }
    
    return count;
  }
  
  private countFolders(collection: any): number {
    let count = 0;
    
    const countItems = (items: any[]): void => {
      if (!items) return;
      
      for (const item of items) {
        if (item.item && !item.request) {
          // This is a folder
          count++;
          countItems(item.item);
        }
      }
    };
    
    if (collection.item) {
      countItems(collection.item);
    }
    
    return count;
  }

  async run(): Promise<void> {
    try {
      await this.initialize();

      const { mode } = await inquirer.prompt([
        {
          type: 'list',
          name: 'mode',
          message: 'What would you like to do?',
          choices: [
            { name: 'Sync once (manual update)', value: 'once' },
            { name: 'Watch for changes (automatic updates)', value: 'watch' }
          ]
        }
      ]);

      if (mode === 'once') {
        await this.syncOnce();
        Logger.success('\n✨ Done!');
      } else {
        await this.startWatching();
      }
    } catch (error: any) {
      Logger.error('\n❌ Error:', error);
      process.exit(1);
    }
  }
}

// Run the application
const updater = new PostmanUpdater();
updater.run();

