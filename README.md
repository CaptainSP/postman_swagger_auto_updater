# Postman Updater

Automatically sync your Swagger/OpenAPI specifications to Postman collections. This tool monitors your API spec and updates your Postman collection whenever changes are detected.

## Features

- 🔄 **Automatic Sync**: Continuously monitors Swagger API for changes
- 🎯 **Smart Detection**: Uses hash comparison to detect actual changes
- 📦 **Full Conversion**: Converts complete OpenAPI/Swagger specs to Postman format
- 🔑 **Secure**: API keys stored locally, never committed
- 💾 **Configuration Management**: Save and reuse configurations
- 🎨 **Beautiful CLI**: Interactive prompts with colored output

## Prerequisites

- Node.js 18 or higher
- Yarn package manager
- A Postman API key ([Get one here](https://learning.postman.com/docs/developer/intro-api/))
- A publicly accessible Swagger/OpenAPI JSON URL

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
yarn install
```

3. Build the project:

```bash
yarn build
```

## Getting Your Postman API Key

1. Go to [Postman](https://www.postman.com/)
2. Sign in to your account
3. Click on your avatar (top right) → **Settings**
4. Go to **API Keys** tab
5. Click **Generate API Key**
6. Copy your key (keep it secure!)

## Usage

### Development Mode (with ts-node)

```bash
yarn dev
```

### Production Mode

```bash
yarn start
```

## How It Works

When you run the script, it will:

1. **Prompt for Configuration** (first time only):
   - Swagger/OpenAPI JSON URL
   - Postman API Key
   - Select from existing collections or create new
   - Poll interval (how often to check for changes)

2. **Choose Mode**:
   - **Sync once**: Manual one-time update
   - **Watch for changes**: Continuous monitoring

3. **Monitor & Sync**:
   - Fetches your Swagger spec
   - Validates the specification
   - Compares with cached version
   - If changed: converts and updates Postman collection
   - Saves hash for next comparison

## Configuration

The tool saves configuration in `.postman-updater.json` in your project directory. You can:

- Reuse existing configuration on subsequent runs
- Manually edit the file if needed
- Delete it to start fresh

Example configuration:

```json
{
  "postmanApiKey": "PMAK-xxxxx...",
  "swaggerUrl": "https://api.example.com/swagger.json",
  "collectionId": "12345678-1234-1234-1234-123456789abc",
  "pollInterval": 300
}
```

## Environment Variables (Alternative)

You can also use environment variables instead of interactive prompts:

1. Copy `.env.example` to `.env`
2. Fill in your values
3. Run with environment variables loaded

## Examples

### Example 1: First Time Setup

```bash
$ yarn dev

🚀 Postman Updater - Swagger to Postman Sync Tool

Please provide the following information:

? Swagger/OpenAPI JSON URL: https://petstore.swagger.io/v2/swagger.json
? Postman API Key: [hidden]
ℹ Validating API key and fetching collections...
✓ Found 2 collection(s) in your workspace

? Select a Postman collection:
❯ ➕ Create a new collection
  ─── Existing Collections ───
  My API (ID: abc123...)
  Test API (ID: def456...)

? Poll interval in seconds: 300

✓ Configuration saved

? What would you like to do? Watch for changes (automatic updates)

──────────────────────────────────────────────────
✓ Started monitoring Swagger API for changes...
ℹ Checking every 300 seconds
ℹ Press Ctrl+C to stop
```

### Example 2: Update Existing Collection

```bash
$ yarn dev

🚀 Postman Updater - Swagger to Postman Sync Tool

ℹ Found existing configuration
? Use existing configuration? Yes
✓ Using existing configuration
✓ Postman API key is valid

? What would you like to do? Sync once (manual update)

ℹ Fetching Swagger spec from: https://api.example.com/swagger.json
✓ Swagger spec fetched and validated successfully
⚠ Changes detected! Updating Postman collection...
ℹ Converting Swagger/OpenAPI spec to Postman collection...
✓ Successfully converted to Postman collection
ℹ Updating Postman collection: 12345678-1234-1234-1234-123456789abc
✓ Collection updated successfully
✓ Postman collection synchronized successfully! ✨

✨ Done!
```

## Project Structure

```
postman_updater/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── services/
│   │   ├── swaggerService.ts   # Swagger API fetching & validation
│   │   ├── postmanService.ts   # Postman API interactions
│   │   └── converterService.ts # Swagger to Postman conversion
│   └── utils/
│       ├── logger.ts           # Logging utilities
│       └── config.ts           # Configuration management
├── dist/                       # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### "Invalid Postman API key"

- Verify your API key is correct
- Check if the key has proper permissions
- Try generating a new key

### "Failed to fetch Swagger spec"

- Ensure the URL is publicly accessible
- Check if the URL returns valid JSON
- Verify your network connection

### "Conversion failed"

- Make sure your Swagger/OpenAPI spec is valid
- Try validating at [Swagger Editor](https://editor.swagger.io/)
- Check if it's OpenAPI 2.0, 3.0, or 3.1 format

### "Collection not found"

- The collection ID might be incorrect
- Leave collection ID empty to create a new one
- Check your Postman workspace

### "Converting circular structure to JSON"

- This has been fixed in v1.1.1+
- Update to the latest version
- The tool now handles circular references in Swagger specs automatically

## API Endpoints Used

This tool uses the following Postman API endpoints:

- `GET /me` - Validate API key
- `GET /collections` - List collections
- `GET /collections/:id` - Get collection details
- `POST /collections` - Create new collection
- `PUT /collections/:id` - Update existing collection

## Contributing

Feel free to submit issues or pull requests!

## License

MIT

## Credits

Built with:
- [openapi-to-postmanv2](https://github.com/postmanlabs/openapi-to-postman) - OpenAPI to Postman conversion
- [swagger-parser](https://github.com/APIDevTools/swagger-parser) - Swagger/OpenAPI parsing
- [inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive CLI
- [axios](https://github.com/axios/axios) - HTTP client
- [chalk](https://github.com/chalk/chalk) - Terminal styling

