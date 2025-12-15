export interface Config {
  postmanApiKey: string;
  swaggerUrl: string;
  collectionId?: string;
  pollInterval: number;
}

export interface PostmanCollection {
  collection: {
    info: {
      name: string;
      description?: string;
      schema: string;
    };
    item: any[];
  };
}

export interface PostmanCollectionResponse {
  collection: {
    id: string;
    name: string;
    uid: string;
  };
}

export interface SwaggerSpec {
  openapi?: string;
  swagger?: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, any>;
}

