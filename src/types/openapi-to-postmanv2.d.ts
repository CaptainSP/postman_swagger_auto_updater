declare module 'openapi-to-postmanv2' {
  interface ConversionOptions {
    folderStrategy?: 'Tags' | 'Paths';
    requestParametersResolution?: 'Example' | 'Schema';
    exampleParametersResolution?: 'Example' | 'Schema';
    optimizeConversion?: boolean;
    stackLimit?: number;
  }

  interface ConversionInput {
    type: 'json' | 'file' | 'string';
    data: any;
  }

  interface ConversionResult {
    result: boolean;
    reason?: string;
    output?: any[];
  }

  type ConversionCallback = (error: Error | null, result: ConversionResult) => void;

  function convert(
    input: ConversionInput,
    options: ConversionOptions,
    callback: ConversionCallback
  ): void;

  export = { convert };
}

