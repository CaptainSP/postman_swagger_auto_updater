# Quick Start Guide

Get started with Postman Updater in 3 simple steps!

## Step 1: Install Dependencies

```bash
yarn install
```

## Step 2: Build the Project

```bash
yarn build
```

## Step 3: Run the Tool

### Option A: Development Mode (Recommended for first run)

```bash
yarn dev
```

### Option B: Production Mode

```bash
yarn start
```

## First Time Usage Example

When you run the tool for the first time:

```bash
$ yarn dev

🚀 Postman Updater - Swagger to Postman Sync Tool

──────────────────────────────────────────────────
ℹ Please provide the following information:

? Swagger/OpenAPI JSON URL: https://petstore.swagger.io/v2/swagger.json
? Postman API Key: ********************************
ℹ Validating API key and fetching collections...
✓ Found 3 collection(s) in your workspace

? Select a Postman collection:
  ➕ Create a new collection
  ─── Existing Collections ───
❯ My API Collection (ID: abc123...)
  Test Collection (ID: def456...)
  Production API (ID: ghi789...)

? Poll interval in seconds: 300
```

### Get Your Postman API Key

1. Visit [Postman API Keys](https://go.postman.co/settings/me/api-keys)
2. Click "Generate API Key"
3. Name it (e.g., "Swagger Updater")
4. Copy the key

### Find Your Swagger URL

Your Swagger URL should:
- Be publicly accessible
- Return JSON format
- Be a valid OpenAPI 2.0, 3.0, or 3.1 spec

Common patterns:
- `https://api.example.com/swagger.json`
- `https://api.example.com/v1/swagger.json`
- `https://api.example.com/api-docs`
- `https://api.example.com/openapi.json`

## Choose Your Mode

### Sync Once
- Manual one-time update
- Perfect for testing or occasional updates
- Runs immediately and exits

### Watch for Changes
- Continuous monitoring
- Automatically detects and syncs changes
- Checks at regular intervals (default: 5 minutes)
- Press Ctrl+C to stop

## What Happens Next?

1. **First Run**: Creates a new Postman collection
2. **Subsequent Runs**: Updates existing collection
3. **No Changes**: Skips update (efficient!)
4. **Changes Detected**: Automatically syncs to Postman

## Troubleshooting

### "Cannot fetch Swagger spec"
- Check if URL is accessible
- Verify it returns valid JSON
- Try opening the URL in your browser

### "Invalid API Key"
- Verify your Postman API key
- Check if it hasn't expired
- Generate a new key if needed

### "Collection not found"
- Leave collection ID empty to create new
- Check if collection was deleted in Postman
- Verify the collection ID is correct

## Configuration File

After first run, settings are saved in `.postman-updater.json`:

```json
{
  "postmanApiKey": "PMAK-...",
  "swaggerUrl": "https://api.example.com/swagger.json",
  "collectionId": "abc123...",
  "pollInterval": 300
}
```

You can:
- Edit this file manually
- Delete it to reconfigure
- Reuse it across runs

## Cache File

The tool creates `.swagger-cache.json` to track changes:

```json
{
  "hash": "abc123...",
  "timestamp": 1234567890
}
```

This ensures updates only happen when your API actually changes!

## Tips

1. **Start with "Sync Once"** to test your setup
2. **Use Watch Mode** for continuous development
3. **Check Postman** after first sync to verify collection
4. **Use longer intervals** (10+ minutes) for production APIs
5. **Keep API key secure** - never commit it to git

## Example: Public API Test

Try with Petstore API (Swagger's official example):

```bash
Swagger URL: https://petstore.swagger.io/v2/swagger.json
```

This is perfect for testing the tool!

## Need Help?

- Check the main [README.md](README.md) for detailed docs
- Review your Swagger spec at [editor.swagger.io](https://editor.swagger.io/)
- Verify API key in Postman settings
- Check logs for specific error messages

---

**Ready? Let's go!** 🚀

```bash
yarn dev
```

